package no.sjosyn.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat

// Loops an alarm (device's own alarm sound, on the ALARM audio stream so it
// rings through silent/DND) + vibration + a full-screen notification with a
// Stop action, until the user dismisses it. Triggered by SjosynMessagingService
// on an incoming FCM data message with mode=alarm — works with the app
// backgrounded or fully killed, since this is a plain Android Service, not
// dependent on the Capacitor WebView/JS runtime being alive.
class AlarmService : Service() {

    companion object {
        const val ACTION_START = "no.sjosyn.app.action.START_ALARM"
        const val ACTION_STOP = "no.sjosyn.app.action.STOP_ALARM"
        const val EXTRA_TITLE = "title"
        const val EXTRA_BODY = "body"
        const val CHANNEL_ID = "sjosyn_alarm"
        const val NOTIFICATION_ID = 4271
        // Hard safety cap — auto-stops the ENTIRE alarm (sound + vibration +
        // wake lock) even if the user never acknowledges, so a bug or an
        // ignored alarm can never drain the battery / ring all day.
        const val MAX_WAKE_LOCK_MS = 10 * 60 * 1000L
    }

    private var mediaPlayer: MediaPlayer? = null
    private var vibrator: Vibrator? = null
    private var wakeLock: PowerManager.WakeLock? = null
    private val autoStopHandler = Handler(Looper.getMainLooper())
    private val autoStopRunnable = Runnable { stopAlarm() }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Null intent = OS re-delivery etter en kill (START_NOT_STICKY skal
        // hindre dette, men vær defensiv): IKKE re-arm en fantom-alarm.
        if (intent == null) {
            stopSelf()
            return START_NOT_STICKY
        }
        if (intent.action == ACTION_STOP) {
            stopAlarm()
            return START_NOT_STICKY
        }

        val title = intent.getStringExtra(EXTRA_TITLE) ?: "⚠ Sjøsyn-varsel"
        val body = intent.getStringExtra(EXTRA_BODY) ?: "Et fartøy krysset en vakt"

        ensureChannel()
        try {
            startForeground(NOTIFICATION_ID, buildNotification(title, body))
        } catch (e: Exception) {
            // FGS-start nektet (Android 12+ bakgrunnsbegrensning, eller Doze
            // nedgraderte FCM-meldingen). IKKE krasj prosessen — vis i det
            // minste et vanlig varsel så brukeren blir varslet, ring/vibrer
            // best-effort, og gi opp fint.
            try {
                val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                nm.notify(NOTIFICATION_ID, buildNotification(title, body))
            } catch (_: Exception) { /* ignore */ }
            startRinging()
            startVibrating()
            acquireWakeLock()
            scheduleAutoStop()
            return START_NOT_STICKY
        }
        acquireWakeLock()
        startRinging()
        startVibrating()
        scheduleAutoStop()

        // START_NOT_STICKY: en drept alarm-tjeneste skal IKKE auto-restartes av
        // OS med null-intent (ville re-armet en fantom-alarm). En reell ny
        // krysning kommer uansett som en ny FCM-melding.
        return START_NOT_STICKY
    }

    private fun scheduleAutoStop() {
        autoStopHandler.removeCallbacks(autoStopRunnable)
        autoStopHandler.postDelayed(autoStopRunnable, MAX_WAKE_LOCK_MS)
    }

    override fun onDestroy() {
        stopAlarm()
        super.onDestroy()
    }

    private fun ensureChannel() {
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (nm.getNotificationChannel(CHANNEL_ID) == null) {
            val channel = NotificationChannel(CHANNEL_ID, "Sjøsyn-alarm", NotificationManager.IMPORTANCE_HIGH).apply {
                description = "Kontinuerlig alarm når et fartøy krysser en vakt"
                // MediaPlayer plays the actual alarm sound on its own audio
                // stream — the notification channel itself stays silent so
                // Android doesn't ALSO play its own (non-looping) sound.
                setSound(null, null)
                enableVibration(false)
            }
            nm.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(title: String, body: String): Notification {
        val stopIntent = Intent(this, AlarmService::class.java).apply { action = ACTION_STOP }
        val stopPendingIntent = PendingIntent.getService(
            this, 1, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Trykk på varsel-kroppen: åpne appen OG stopp alarmen. Dette er den
        // naturlige gesten for en stresset bruker (som ellers ikke fant den
        // lille «Stopp»-knappen). MainActivity leser stop_alarm-extra.
        val openStopIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("stop_alarm", true)
        }
        val openStopPending = PendingIntent.getActivity(
            this, 2, openStopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Full-screen (låseskjerm): bare vis appen — IKKE stopp. Ellers ville
        // alarmen stoppet i det full-screen-UI-et vises, før bekreftelse.
        val fullScreenIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val fullScreenPending = PendingIntent.getActivity(
            this, 3, fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(fullScreenPending, true)
            .setContentIntent(openStopPending)
            .addAction(0, "Stopp", stopPendingIntent)
            .setOngoing(true)
            .setAutoCancel(false)
            .build()
    }

    private fun startRinging() {
        try {
            val alarmUri = RingtoneManager.getActualDefaultRingtoneUri(this, RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            mediaPlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                setDataSource(this@AlarmService, alarmUri)
                isLooping = true
                prepare()
                start()
            }
        } catch (e: Exception) {
            // Best-effort — vibration still fires even if audio setup fails
            // (e.g. no alarm sound configured on the device).
        }
    }

    private fun startVibrating() {
        val pattern = longArrayOf(0, 800, 400)
        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vm = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
            vm.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator?.vibrate(VibrationEffect.createWaveform(pattern, 0))
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(pattern, 0)
        }
    }

    private fun acquireWakeLock() {
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Sjosyn:AlarmWakeLock").apply {
            acquire(MAX_WAKE_LOCK_MS)
        }
    }

    private fun stopAlarm() {
        autoStopHandler.removeCallbacks(autoStopRunnable)
        mediaPlayer?.let {
            try { if (it.isPlaying) it.stop() } catch (e: Exception) { /* ignore */ }
            it.release()
        }
        mediaPlayer = null
        vibrator?.cancel()
        vibrator = null
        wakeLock?.let { if (it.isHeld) it.release() }
        wakeLock = null
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        nm.cancel(NOTIFICATION_ID)
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }
}

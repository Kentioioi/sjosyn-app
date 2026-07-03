package no.sjosyn.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

// Replaces Capacitor's own MessagingService (removed from the manifest via
// tools:node="remove" — see AndroidManifest.xml) so incoming FCM messages are
// handled here first, in plain Kotlin, regardless of whether the WebView/JS
// runtime is alive. Still forwards to PushNotificationsPlugin's static
// methods so the existing JS-side registration/foreground-push flow (built
// in M3) keeps working exactly as before.
class SjosynMessagingService : FirebaseMessagingService() {

    companion object {
        const val CHIME_CHANNEL_ID = "sjosyn_chime"
        const val CHIME_NOTIFICATION_ID = 4272
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        PushNotificationsPlugin.sendRemoteMessage(remoteMessage)

        val data = remoteMessage.data
        when (data["mode"]) {
            "alarm" -> {
                val intent = Intent(this, AlarmService::class.java).apply {
                    action = AlarmService.ACTION_START
                    putExtra(AlarmService.EXTRA_TITLE, data["title"] ?: "⚠ Sjøsyn-varsel")
                    putExtra(AlarmService.EXTRA_BODY, data["body"] ?: "")
                }
                ContextCompat.startForegroundService(this, intent)
            }
            "chime" -> {
                val title = data["title"]
                if (title != null) showChimeNotification(title, data["body"] ?: "")
            }
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        PushNotificationsPlugin.onNewToken(token)
    }

    private fun showChimeNotification(title: String, body: String) {
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (nm.getNotificationChannel(CHIME_CHANNEL_ID) == null) {
            nm.createNotificationChannel(
                NotificationChannel(CHIME_CHANNEL_ID, "Sjøsyn-varsel", NotificationManager.IMPORTANCE_HIGH)
            )
        }
        val contentIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this, 0, contentIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        val notification = NotificationCompat.Builder(this, CHIME_CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()
        nm.notify(CHIME_NOTIFICATION_ID, notification)
    }
}

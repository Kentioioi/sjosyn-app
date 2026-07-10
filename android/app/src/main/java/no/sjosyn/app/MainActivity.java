package no.sjosyn.app;

import android.content.Intent;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        maybeStopAlarm(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        maybeStopAlarm(intent);
    }

    // Trykk på alarm-varselets kropp åpner appen med stop_alarm-extra → stopp
    // den kjørende alarm-tjenesten. Gir en pålitelig «stopp»-gest i tillegg til
    // «Stopp»-knappen i varselet.
    private void maybeStopAlarm(Intent intent) {
        if (intent != null && intent.getBooleanExtra("stop_alarm", false)) {
            Intent stop = new Intent(this, AlarmService.class);
            stop.setAction(AlarmService.ACTION_STOP);
            startService(stop);
        }
    }
}

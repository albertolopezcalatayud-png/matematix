package com.matematix.app;

import android.content.Context;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Prints a page made in the app (worksheets, certificates, games, session sheets) with Android's own print
 * service: printer, "Save as PDF" or sharing. The page is built on the device; nothing is uploaded.
 */
@CapacitorPlugin(name = "Printer")
public class PrinterPlugin extends Plugin {
    // kept until the next print so the system can read it while the print dialog is open
    private WebView printView;

    @PluginMethod
    public void printHtml(PluginCall call) {
        final String html = call.getString("html", "");
        final String title = call.getString("title", "Matematix");
        final boolean landscape = Boolean.TRUE.equals(call.getBoolean("landscape", false));
        getActivity().runOnUiThread(() -> {
            WebView w = new WebView(getContext());
            w.getSettings().setJavaScriptEnabled(false);
            w.setWebViewClient(new WebViewClient() {
                private boolean done = false;
                @Override
                public void onPageFinished(WebView view, String url) {
                    if (done) return;
                    done = true;
                    PrintManager pm = (PrintManager) getActivity().getSystemService(Context.PRINT_SERVICE);
                    PrintAttributes attrs = new PrintAttributes.Builder()
                        .setMediaSize(landscape ? PrintAttributes.MediaSize.ISO_A4.asLandscape() : PrintAttributes.MediaSize.ISO_A4)
                        .build();
                    pm.print(title, view.createPrintDocumentAdapter(title), attrs);
                    call.resolve();
                }
            });
            printView = w;
            w.loadDataWithBaseURL("https://localhost/", html, "text/html", "UTF-8", null);
        });
    }
}

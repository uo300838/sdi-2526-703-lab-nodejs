package com.uniovi.sdi;

import org.codehaus.jackson.node.ObjectNode;

import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.MediaType;

public class UpdateMemoryThread extends Thread {
    private final Window window;

    public UpdateMemoryThread(Window window) {
        this.window = window;
    }

    @Override
    public void run() {
        try {
            ObjectNode responseJSON = ClientBuilder.newClient()
                    .target("http://localhost:3000/memory")
                    .request()
                    .accept(MediaType.APPLICATION_JSON)
                    .get()
                    .readEntity(ObjectNode.class);

            // El servidor puede devolver "memory" o "memoria" según el ejercicio.
            String memory;
            if (responseJSON.get("memory") != null) {
                memory = responseJSON.get("memory").toString();
            } else if (responseJSON.get("memoria") != null) {
                memory = responseJSON.get("memoria").toString();
            } else {
                memory = responseJSON.toString();
            }

            window.updateMemory(memory);
        } catch (Exception e) {
            window.updateError(e.getClass().getSimpleName());
        }
    }
}


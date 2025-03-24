#!/bin/bash

# Check if the certificate already exists
if [ ! -f /data/tls/fullchain.pem ]; then
  echo "Generating self-signed certificate..."
  openssl req -x509 -newkey rsa:4096 -keyout /data/tls/privkey.pem -out /data/tls/fullchain.pem -days 365 -nodes -subj "/CN=mx.livelearnpro.com, O=Your Organization"
  echo "Self-signed certificate generated."
else
  echo "Certificate already exists. Skipping generation."
fi

FROM curlimages/curl:7.78.0 as download
ARG IR2MQTT_VERSION="v0.1"

WORKDIR /tmp
RUN curl -L -f https://github.com/Lodeiro0001/ir2MQTT/releases/download/${IR2MQTT_VERSION}/ir2MQTT_${IR2MQTT_VERSION}_linux-amd64.zip --output download.zip && \
    unzip download.zip

FROM scratch

COPY --from=download /tmp/ir2MQTT/ /ir2MQTT
ENTRYPOINT ["/ir2MQTT/ir2MQTT"]

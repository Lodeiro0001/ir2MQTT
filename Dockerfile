ARG IR2MQTT_VERSION="master"

FROM golang:latest AS builder
ARG IR2MQTT_VERSION
RUN apt-get update && apt-get install git

# Clone repository
WORKDIR /tmp
RUN git clone --depth 1 --branch ${IR2MQTT_VERSION} https://github.com/Lodeiro0001/ir2MQTT ir2MQTT_clone && \
    mv ir2MQTT_clone/src $GOPATH/src/ir2MQTT

# Build
WORKDIR $GOPATH/src/ir2MQTT
RUN go mod init && \
    go mod tidy && \
    GOOS=linux GOARCH=amd64 go build -a -tags netgo -ldflags "-linkmode external -extldflags '-static' -s -w" -o /tmp/ir2MQTT_bin *.go

# Move usable files to final directory
RUN mkdir /tmp/ir2MQTT && \
    mv /tmp/ir2MQTT_bin /tmp/ir2MQTT/ir2MQTT && \
    mv $GOPATH/src/ir2MQTT/gui /tmp/ir2MQTT && \
    chmod +x /tmp/ir2MQTT/ir2MQTT

FROM scratch
COPY --from=builder /tmp/ir2MQTT/ /ir2MQTT
WORKDIR /ir2MQTT
ENTRYPOINT ["./ir2MQTT"]

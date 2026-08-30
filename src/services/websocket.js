export const createTelemetrySocket = ({ url, onMessage, onOpen, onClose, onError }) => {
  if (!url || typeof WebSocket === 'undefined') {
    return {
      connected: false,
      close: () => {},
      send: () => {},
      reconnect: () => {}
    };
  }

  const socket = new WebSocket(url);

  socket.onopen = () => {
    if (onOpen) onOpen();
  };

  socket.onmessage = (event) => {
    if (onMessage) {
      try {
        const parsed = JSON.parse(event.data);
        onMessage(parsed);
      } catch (error) {
        onMessage(event.data);
      }
    }
  };

  socket.onerror = (event) => {
    if (onError) onError(event);
  };

  socket.onclose = () => {
    if (onClose) onClose();
  };

  return {
    connected: true,
    socket,
    close: () => socket.close(),
    send: (data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(typeof data === 'string' ? data : JSON.stringify(data));
      }
    },
    reconnect: () => createTelemetrySocket({ url, onMessage, onOpen, onClose, onError })
  };
};

export default createTelemetrySocket;

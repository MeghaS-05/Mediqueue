let stompClient = null;

export function connectWebSocket(onConnected, onError){
    import('sockjs-client').then(({default: SockJS}) =>{
        import('@stomp/stompjs').then(({Client}) =>{
            const token = localStorage.getItem('token');
            stompClient = new Client({
                webSocketFactory: ()=> new SockJS('/ws'),
                connectHeaders: {Authorization: `Bearer ${token}`},
                reconnectDelay: 5000,
                onConnect: ()=>{console.log('WS connected'); onConnected?.(stompClient);},
                onStompError: frame =>{console.error('WS error', frame); onError?.(frame);},
            });
            stompClient.activate();
        });
    });
}

export function subscribeToQueue(deptId, callback) {
  return stompClient?.subscribe(`/topic/queue/${deptId}`, msg => callback(JSON.parse(msg.body)));
}

export function subscribeToPatient(tokenId, callback) {
  return stompClient?.subscribe(`/topic/patient/${tokenId}`, msg => callback(JSON.parse(msg.body)));
}

export function subscribeToEmergency(deptId, callback) {
  return stompClient?.subscribe(`/topic/emergency/${deptId}`, msg => callback(JSON.parse(msg.body)));
}

export function disconnect() {
  stompClient?.deactivate();
  stompClient = null;
}
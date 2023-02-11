navigator.bluetooth.requestDevice({
  filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }]
})
.then(device => {
  console.log('Connecting to ' + device.name);
  return device.gatt.connect();
})
.then(server => {
  console.log('Getting NUS Service...');
  return server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
})
.then(service => {
  console.log('Getting NUS RX Characteristic...');
  return service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
})
.then(characteristic => {
  console.log('Start Notifying...');
  return characteristic.startNotifications().then(_ => {
    console.log('Notifications started');
    characteristic.addEventListener('characteristicvaluechanged',
      handleNUSData);
  });
})
.catch(error => { console.log(error); });

function handleNUSData(event) {
  let value = new TextDecoder().decode(event.target.value);
  console.log('Received NUS data: ' + value);
}

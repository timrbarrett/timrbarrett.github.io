var button = document.getElementById("connect-button");
button.addEventListener('click', async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'NUS' }],
      optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
    });

    const server = await device.gatt.connect();
    console.log('Connected to NUS device');
  } catch (error) {
    console.error(error);
  }
});
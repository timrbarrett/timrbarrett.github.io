# LimbStim Bench Control

Minimal Web Bluetooth control page for bench-testing the Zephyr LimbStim.

## Use

1. Open `index.html` in Chrome or Edge on a machine with BLE.
2. Click `Connect LimbStim` and select the LimbStim BLE device.
3. Use `Setup and run CH1` or `Setup and run CH2`.
4. Vary `c?mx` and `c?fi` with the sliders while watching the oscilloscope.
5. Use `All channels safe off` before changing wiring.

## Command Model

The page uses Nordic UART Service:

- Service: `6e400001-b5a3-f393-e0a9-e50e24dcca9e`
- RX/write: `6e400002-b5a3-f393-e0a9-e50e24dcca9e`
- TX/notify: `6e400003-b5a3-f393-e0a9-e50e24dcca9e`

For a slider change, the page sends:

```lisp
(emo c1mx 127)
(ecr c1mx)
(adr 1 3)
```

or the equivalent channel/control.

AD5254 mapping used by current Zephyr firmware:

- `c1mx`: channel 1, RDAC3
- `c1fi`: channel 1, RDAC2
- `c2mx`: channel 2, RDAC3
- `c2fi`: channel 2, RDAC2

`Setup and run` configures a simple 10 Hz default pulse train unless the frequency/pulse-width fields are changed.

﻿    const MCP3425 = 0x68;//MCP3425 i2cアドレス
    const CONFIG = 0x88;
    const deltaWait = 70000;//70ms

    var i2c = require('i2c');//i2cなしのデバッグの場合はここをコメントアウト
    var sleep = require('sleep');//i2cなしのデバッグの場合はここをコメントアウト

    var addr = MCP3425;
    var wire;

    export class checkVoltagePower {

        
        private beforeDriveDir: string = "standy";
        private voltageBefore: number = 0;
        /**
         * コンストラクタ
         */
        constructor() {
            //i2cなしのデバッグの場合はここをコメントアウト
            wire = new i2c(MCP3425, { device: '/dev/i2c-1', debug: false });
        }

        
        public checkVoltage(): number {

            var voltage: number;

            console.log("check voltage start!\n");
            wire.writeByte(CONFIG, function (err) {
                if (err) {
                    console.log("i2c initialize error!\n");
                }
            });

            var bufPresData: Array<number>;
            var raw: number;
            var voltage: number;
            var volParBit: number;
            sleep.usleep(deltaWait);

            wire.read(2, function (err, res) {
                if (err) {
                    console.log("i2c read error!\n");
                } else {
                    raw = res[0] << 8;
                    raw = raw | res[1];
                    if (raw > 32767) {
                        raw -= 65535;
                    }
                }
            });
            
            volParBit = 2.048 / 32767;
            voltage = volParBit * raw;
            console.log("power voltage : "+voltage+"\n");
            return voltage;

        }
    }
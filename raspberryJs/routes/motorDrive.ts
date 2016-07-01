﻿    const DRV8830_0 = 0x60;
    const DRV8830_1 = 0x62;
    const CONTROL_REG = 0x00;
    const FAULT_REG = 0x01;

    const STANBY = 0x00;
    const NEG_ROT = 0x02;
    const POS_ROT = 0x01;
    const BREAK = 0x03;
    //var i2c = require('i2c');
    var addr = DRV8830_0;

    var wire0;
    var wire1;


    export class motorDrive {


        /**
         * コンストラクタ
         */
        constructor() {

            //wire0 = new i2c(DRV8830_0, { device: '/dev/i2c-1', debug: false });
            //wire1 = new i2c(DRV8830_1, { device: '/dev/i2c-1', debug: false });
        }
    
        /**
         *  GET users listing. 
         *以下の感じでurlを入力すれば実行できる
         *http://192.168.1.98:3000/users?num=0&drive=break&volt=1.0
         * @param queryDatas
         */
        public drive(voltage: number, motorNum: number, driveDir: string): boolean {

            var vSetF = voltage;//voltクエリにて電圧を取得
            var vSet = ((vSetF * 100)) / 8;
            var drive = STANBY;

            var driveStr = driveDir;//driveクエリにて回転方向を取得

            if (driveStr == 'pos') {
                drive = POS_ROT;
            } else if (driveStr == 'neg') {
                drive = NEG_ROT;
            } else if (driveStr == 'break') {
                drive = BREAK;
            } else {
            }

            var controlData = CONTROL_REG;
            var byteData = (vSet << 2) | drive;
            console.log(byteData);

            var motorNo = motorNum;

            if (motorNo == 0) {
                console.log("motor0 Start!\n");
                wire0.writeBytes(controlData, [byteData], function (err, res) { });
            } else {
                console.log("motor1 Start!\n");
                wire1.writeBytes(controlData, [byteData], function (err, res) { });
            }
            return true;
        }

        public getStatus(motorNum: number): string {

            var controlData = FAULT_REG;
            var motorMessage: string ;
            
            if (motorNum == 0) {
                motorMessage = "motor0 status is ";
                wire0.readBytes(controlData, 1, function (err, res){
	
                    if ((res[0] & 0x01) != 0) {//一番下位のビット判定
                        if ((res[0] & 0x02) != 0) {
                            motorMessage += ",OCP!";
                        }
                        if ((res[0] & 0x04) != 0) {
                            motorMessage += ",UVLO!";
                        }
                        if ((res[0] & 0x08) != 0) {
                            motorMessage += ",OTS!";
                        }
                        if ((res[0] & 0x10) != 0) {
                            motorMessage += ",ILIMIT!";
                        }
                    } else {
                        motorMessage = "motor0 Normal!";
                    }
                });
            } else {
                motorMessage = "motor1 status is ";                
                wire1.readBytes(controlData, 1, function (err, res) {
                    if ((res[0] & 0x01) != 0) {//一番下位のビット判定
                        if ((res[0] & 0x02) != 0) {
                            motorMessage += ",OCP!";
                        }
                        if ((res[0] & 0x04) != 0) {
                            motorMessage += ",UVLO!";
                        }
                        if ((res[0] & 0x08) != 0) {
                            motorMessage += ",OTS!";
                        }
                        if ((res[0] & 0x10) != 0) {
                            motorMessage += ",ILIMIT!";
                        }
                    } else {
                        motorMessage = "motor1 Normal!";
                    }
                });
            }
            console.log(motorMessage);
            return motorMessage;
        }

    }
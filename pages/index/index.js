//index.js
//获取应用实例
const app = getApp()

var cal_data=101300
var press_data

Page({
  data: {

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  clicktest: function(){
    console.log("click")
    cal_data=press_data+20
    // this.setData({
    //   style_name:"style2"
    // });

  },

  canvasDrawData: function (arr) {
    //console.log(arr)
    const ctx = wx.createCanvasContext('firstCanvas')
    ctx.beginPath();
    for(var i=0; i<5;i++){
      ctx.moveTo(0,100*(i+1))
      ctx.lineTo(340, 100*(i+1))
    }
    ctx.strokeStyle="#E0E0E0"
    ctx.stroke();

    ctx.beginPath();
    for(var i=0;i<7;i++){
      ctx.fillText(100-i*20,5,100*(i));
     //ctx.clearRect(0, 0, 300, 200)
    }
    ctx.moveTo(0, 500-arr[0]/40)
    for(var i=0; i<arr.length;i++){
      ctx.lineTo(i, 500-arr[i]/40)
    }
    ctx.strokeStyle="#00eeee"
    ctx.stroke()
    ctx.draw()
    // var maxh = 0
    // var minh = 0
    // var step = 3
    // let arr = this.data.dataArray
    // for (var j=0;j<arr.length;j++){
    //   if (arr[j]>maxh){
    //     maxh = arr[j]
    //   }
    //   if (arr[j]<minh){
    //     minh = arr[j]
    //   }
    // }
    // var abs = maxh - minh
    // if(abs<160){
    //   abs=160
    // }
    // console.log("maxh:"+maxh+" minh:"+minh)
    // for (var i=0;i<arr.length;i++){
    //   let x = 10+i*step
    //   let y = 80+arr[i]*160/abs
    //   if (i==0){
    //     ctx.moveTo(x, y)
    //   }
    //   ctx.lineTo(x, y)
    //   console.log("x:"+10+i*step+" y:"+arr[i])
    // }
    // ctx.stroke()
    // ctx.draw()
    // console.log(canvasDrawData)
  },

  getCalibrationValue:function(){
    return 101300;
  },


  startBLE:function(){
    var that = this
    let buffer = new ArrayBuffer(1)
    let dataView = new DataView(buffer)
    dataView.setUint8(0, 1)
    //蓝牙初始化
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res)
        wx.startBluetoothDevicesDiscovery({
          success: function(res) {
          },
        })
      },
      fail: function (res) {
        console.log(res)
        // wx.showModal({
        //   title: '提示',
        //   content: '请检查手机蓝牙是否打开',
        // })
      },
    })

    wx.onBluetoothDeviceFound(function (res) {
          console.log(res.devices[0].name)
          var devicename=res.devices[0].name
          if(devicename=="JDY-19"){
            var deviceID = res.devices[0].deviceId
            console.log(deviceID)
            wx.stopBluetoothDevicesDiscovery({
              success: function(res) {

              },
            })

            wx.createBLEConnection({
              deviceId:res.devices[0].deviceId,
              success: function() {
                console.log("jacob_connected")
                wx.getBLEDeviceServices({
                    deviceId: res.devices[0].deviceId,
                    success: function (jacob_sid) {
                     console.log("jacob_connected_services")
                     console.log('device services:', jacob_sid.services[0].uuid)
                     wx.getBLEDeviceCharacteristics({
                        deviceId:res.devices[0].deviceId,
                        serviceId: jacob_sid.services[0].uuid,  
                        success: function (jacob_cr) {
                          console.log('device getBLEDeviceCharacteristics:', jacob_cr.characteristics[0].uuid)
                          wx.writeBLECharacteristicValue({
                            deviceId:res.devices[0].deviceId,
                            serviceId: jacob_sid.services[0].uuid, 
                            characteristicId:jacob_cr.characteristics[0].uuid,
                            value: buffer,
                            success (res) {
                              console.log('writeBLECharacteristicValue success', res.errMsg)
                            }
                          })
                          var arr=[]
                          wx.notifyBLECharacteristicValueChange({
                            state: true, // 启用 notify 功能
                            deviceId:res.devices[0].deviceId,
                            serviceId: jacob_sid.services[0].uuid, 
                            characteristicId:jacob_cr.characteristics[0].uuid,
                            success (res) {
                              console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                              wx.onBLECharacteristicValueChange(function(jacob_data) {
                                var n = String.fromCharCode.apply(null, new Uint8Array(jacob_data.value));
                                press_data = parseInt(n)
                                // var a = that.getCalibrationValue();
                                var show_data = press_data - cal_data
                                //console.log(show_data);
                                arr.push(show_data)
                                if(arr.length>340){
                                  arr.shift();
                                }
                                //console.log("arr_length"+arr.length)

                                that.canvasDrawData(arr);
                              })
                            }
                          })
                        }
                     })
                    },

                })
              },
            })
          }
    })

  },


  onLoad: function () {
    this.startBLE();
    //var sysInfo=wx.getS
    //this.canvasDrawData([265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209,265,267,284,221,209]);
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})




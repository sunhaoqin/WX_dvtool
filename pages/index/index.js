//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    dataArray:[78,79,80,78,76,70,78,79,80,78,76,70,78,79,80,78,76,70]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
        wx.showModal({
          title: '提示',
          content: '请检查手机蓝牙是否打开',
        })
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
                          wx.notifyBLECharacteristicValueChange({
                            state: true, // 启用 notify 功能
                            deviceId:res.devices[0].deviceId,
                            serviceId: jacob_sid.services[0].uuid, 
                            characteristicId:jacob_cr.characteristics[0].uuid,
                            success (res) {
                              console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                              wx.onBLECharacteristicValueChange(function(jacob_data) {
                                var n = String.fromCharCode.apply(null, new Uint8Array(jacob_data.value));
                                var a = that.getCalibrationValue();
                                var show_data = parseInt(n) - a
                                console.log(show_data);

                                var arr=that.data.dataArray
                                arr.push(show_data)
                                if(arr.length>200){
                                  arr.shift();
                                }
                                console.log("arr_length"+arr.length)
                                that.setData({
                                  dataArray:arr
                                });
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



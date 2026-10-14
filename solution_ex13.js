const initialDevices = [
  { id: 'dev_1', name: 'Đèn phòng khách', type: 'light', power: 40, status: 'OFF', connected: true },
  { id: 'dev_2', name: 'Điều hòa phòng ngủ', type: 'ac', power: 1200, status: 'OFF', connected: true },
  { id: 'dev_3', name: 'Bình nóng lạnh', type: 'heater', power: 2500, status: 'OFF', connected: true },
  { id: 'dev_4', name: 'Camera an ninh', type: 'camera', power: 15, status: 'ON', connected: false }
];

const createDevice = (list, dev) => {
  if (!dev.id || !dev.name || typeof dev.power !== 'number') {
    console.log('[LỖI] Thông tin thiết bị không hợp lệ!');
    return list;
  }
  const exists = list.some(item => item.id === dev.id);
  if (exists) {
    console.log('[LỖI] Thiết bị với ID này đã tồn tại!');
    return list;
  }
  console.log('[THÀNH CÔNG] Đã thêm thiết bị: ' + dev.name);
  return [...list, { ...dev, status: 'OFF', connected: true }];
};

const triggerScene = (list, sceneName) => {
  const validScenes = ['GoodMorning', 'LeaveHome', 'SleepMode'];
  if (!validScenes.includes(sceneName)) {
    console.log('[LỖI EDGE CASE] Ngữ cảnh ' + sceneName + ' không tồn tại trong hệ thống!');
    return list;
  }

  console.log('[KÍCH HOẠT] Đang thực thi ngữ cảnh: ' + sceneName);
  return list.map(dev => {
    if (!dev.connected) return dev;
    
    if (sceneName === 'GoodMorning') {
      if (dev.type === 'light') return { ...dev, status: 'ON' };
    } else if (sceneName === 'LeaveHome') {
      return { ...dev, status: 'OFF' };
    } else if (sceneName === 'SleepMode') {
      if (dev.type === 'light') return { ...dev, status: 'OFF' };
      if (dev.type === 'ac') return { ...dev, status: 'ON' };
    }
    return dev;
  });
};

const calculateEnergy = (list) => {
  const activeDevices = list.filter(dev => dev.status === 'ON' && dev.connected);
  const totalPower = activeDevices.reduce((sum, dev) => sum + dev.power, 0);

  console.log('--- BÁO CÁO NĂNG LƯỢNG ---');
  console.log('Tổng số thiết bị đang hoạt động: ' + activeDevices.length);
  console.log('Tổng công suất tiêu thụ: ' + totalPower + 'W');

  // Edge Case: Quá tải công suất > 3000W
  if (totalPower > 3000) {
    console.log('[CẢNH BÁO EDGE CASE] Hệ thống quá tải (>3000W)! Tự động ngắt các thiết bị công suất lớn.');
    return list.map(dev => {
      if (dev.power > 1000 && dev.status === 'ON') {
        console.log('[NGẮT AN TOÀN] Đã tắt thiết bị: ' + dev.name);
        return { ...dev, status: 'OFF' };
      }
      return dev;
    });
  }

  return list;
};

// Kiểm thử thực thi chương trình
let mySmartHome = [...initialDevices];
mySmartHome = triggerScene(mySmartHome, 'GoodMorning');
mySmartHome = triggerScene(mySmartHome, 'SleepMode');
mySmartHome = calculateEnergy(mySmartHome);

// Kiểm thử Edge Case: Ngữ cảnh không hợp lệ
mySmartHome = triggerScene(mySmartHome, 'PartyMode');

// Kiểm thử Edge Case: Thiết bị lỗi kết nối
const disconnectedList = mySmartHome.map(d => d.id === 'dev_3' ? { ...d, connected: false } : d);
calculateEnergy(disconnectedList);

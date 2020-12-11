export default function mockfile(datalist) {
  let newdatalist = datalist.map((item, i) => {
    return {
      uid: item.id ? item.id : i+1,
      name: `文件${i+1}`,
      status: 'done',
      url: item,
    };
  });
  return {
    fileList: newdatalist,
  };
}

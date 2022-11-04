export class QueryHelper {
  static getConditionCartesianProd(obj) {
    if (!obj || Object.keys(obj).length == 0) return null;
    else if (Object.keys(obj).length == 1) {
      const key = Object.keys(obj)[0];
      const result = [];
      obj[key].forEach((item) => {
        result.push({ [key]: item });
      });
      return result;
    }
    const newArray = [];
    const maintainKeys = Object.keys(obj);
    maintainKeys.forEach((key) => {
      newArray.push(obj[key]);
    });
    let ccnt = 0;
    const result = newArray.reduce((last, current) => {
      const array = [];
      last.forEach((par1) => {
        current.forEach((par2) => {
          if (ccnt == 0)
            array.push({
              [maintainKeys[ccnt]]: par1,
              [maintainKeys[ccnt + 1]]: par2,
            });
          else
            array.push({
              ...par1,
              [maintainKeys[ccnt + 1]]: par2,
            });
        });
      });
      ccnt++;
      return array;
    });
    return result;
  }
}

export default class Collection {
  constructor(data) {
    this.data = data
  }

  raw() {
    return this.data.map(item =>
       Object.keys(item).filter(key => !/^_/.test(key)).reduce((all, key) => {
         all[key] = item[key]
         return all
       }, {})
     )
  }
}

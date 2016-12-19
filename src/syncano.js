const Syncano = require("syncano");

let connection = Syncano({
  // accountKey: "",
  // defaults: {
  //   instanceName: ""
  // }
});

let DataObject = connection.DataObject;

class Data {
  constructor() {
    this.instance = 'company-api'
    this.call = DataObject.please()
  }
  composeParams() {
    return {className: this.className}
  }
  list() {
    return this.call.list(this.composeParams())
  }
}

let data = new Proxy(new Data(), {
    get: function(target, property) {
        target.className = property;
        return target;
    }
});

export { Data };

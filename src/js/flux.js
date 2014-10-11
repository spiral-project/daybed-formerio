var Fluxxor = require("fluxxor");
var randomBytes = require("crypto").randomBytes;

var constants = {
  ADD_FORM_ELEMENT: "ADD_FORM_ELEMENT",
  UPDATE_FORM_ELEMENT: "UPDATE_FORM_ELEMENT",
  DELETE_FORM_ELEMENT: "DELETE_FORM_ELEMENT"
};

var FormElementStore = Fluxxor.createStore({
  initialize: function() {
    this.elements = [];
    this.bindActions(
      constants.ADD_FORM_ELEMENT, this.onAdd,
      constants.UPDATE_FORM_ELEMENT, this.onUpdate,
      constants.DELETE_FORM_ELEMENT, this.onDelete
    );
  },

  onAdd: function(fieldType){
    this.elements.push({
      id: randomBytes(8).toString('hex'),
      fieldType: fieldType,
      data: {}
    });
    this.emit("change");
  },

  onUpdate: function(payload) {
    var element = this.elements.filter(function(el) {
      return el.id === payload.element.id;
    })[0];

    var index = this.elements.indexOf(element);
    this.elements[index] = payload.element;
    this.emit("change");
  },

  onDelete: function(id) {
    this.elements = this.elements.filter(function(el) {
      return el.id !== id;
    });
    this.emit("change");
  },

  getState: function() {
    return {
      elements: this.elements
    };
  }
});

var actions = {
  addFormElement: function(fieldType) {
    this.dispatch(constants.ADD_FORM_ELEMENT, fieldType);
  },
  updateFormElement: function(element) {
    this.dispatch(constants.UPDATE_FORM_ELEMENT, {element: element});
  },
  deleteFormElement: function(id) {
    this.dispatch(constants.DELETE_FORM_ELEMENT, id);
  }
};

var stores = {
  FieldElementsStore: new FormElementStore()
};

var flux = new Fluxxor.Flux(stores, actions);

module.exports = {
  flux: flux,
  actions: actions
};

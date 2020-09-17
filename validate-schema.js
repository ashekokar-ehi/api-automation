  const validateSchema = (() => {
      return(object1, object2) => {
          let isValid = true;
          for(key in object1){
            if(typeof object1[key] === "object" || typeof object2[key] == "object") {
                return validateSchema(object1[key],object2[key]);
            }else if(!object1.hasOwnProperty(key)){
                isValid = false;
            }
          }
      };
  })();

  module.exports = validateSchema;
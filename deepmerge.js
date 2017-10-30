function deepMerge(defaultObject, customObject) {
  //add custom keys
  for (var key in customObject) {
    if (!defaultObject.hasOwnProperty(key) && !(obj[key] === undefined)) {
      defaultObject[key] = customObject[key]
    } else {
      console.log(customObject[key])
    }

  }

  //overwrite
  for (var key in defaultObject) {
    if (defaultObject[key] !== Object(defaultObject[key]) &&
  customObject[key]) {
      defaultObject[key] = customObject[key]
    }
    else if (defaultObject[key] === Object(defaultObject[key])
  && customObject[key]) {
      deepMerge(defaultObject[key], customObject[key])
    }
  }

}

//hardcodey
function merge(defaultConfig, customConfig) {
  if (!customConfig.containerSel) {
    console.log("you must include a containerSel key")
  }
  config.containerSel = customConfig.containerSel;
  config.initPicIndex= customConfig.initPicIndex || defaultConfig.initPicIndex;
  config.swipableInit= customConfig.swipableInit !== false;
  config.paginationInit= customConfig.paginationInit !== false;
  config.buttonInit= customConfig.buttonInit !== false;
  if (customConfig.pagination) {
  Object.assign(config.pagination, customConfig.pagination)
  }
  if (customConfig.leftButton) {
  Object.assign(config.leftButton, customConfig.leftButton)
  }
  if (customConfig.rightButton) {
  Object.assign(config.rightButton, customConfig.rightButton)
  }
  if (customConfig.customListeners) {
    config.customListeners = customConfig.customListeners
  }
}

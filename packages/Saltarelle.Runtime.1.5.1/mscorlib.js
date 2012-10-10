//! Script# Core Runtime
//! More information at http://projects.nikhilk.net/ScriptSharp
//!
if (typeof(global) === "undefined")
  global = window;

var ss = {};

ss.isUndefined = function (o) {
  return (o === undefined);
};

ss.isNull = function (o) {
  return (o === null);
};

ss.isNullOrUndefined = function (o) {
  return (o === null) || (o === undefined);
};

ss.isValue = function (o) {
  return (o !== null) && (o !== undefined);
};

ss.referenceEquals = function (a, b) {
  return ss.isValue(a) ? a === b : !ss.isValue(b);
};

ss.mkdict = function (a) {
  a = (arguments.length != 1 ? arguments : arguments[0]);
  var r = {};
  for (var i = 0; i < a.length; i += 2) {
    r[a[i]] = a[i + 1];
  }
  return r;
};

ss.coalesce = function (a, b) {
  return ss.isValue(a) ? a : b;
};

if (typeof(window) == 'object') {
  // Browser-specific stuff that could go into the Web assembly, but that assembly does not have an associated JS file.
  if (!window.Element) {
  // IE does not have an Element constructor. This implementation should make casting to elements work.
    window.Element = function() {
    };
    window.Element.isInstanceOfType = function(instance) { return instance && typeof instance.constructor === 'undefined' && typeof instance.tagName === 'string'; };
  }

  if (!window.XMLHttpRequest) {
    window.XMLHttpRequest = function() {
      var progIDs = [ 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP' ];
  
      for (var i = 0; i < progIDs.length; i++) {
        try {
          var xmlHttp = new ActiveXObject(progIDs[i]);
          return xmlHttp;
        }
        catch (ex) {
        }
      }
  
      return null;
    };
  }

  ss.parseXml = function(markup) {
    try {
      if (DOMParser) {
        var domParser = new DOMParser();
        return domParser.parseFromString(markup, 'text/xml');
      }
      else {
        var progIDs = [ 'Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument' ];
          
        for (var i = 0; i < progIDs.length; i++) {
          var xmlDOM = new ActiveXObject(progIDs[i]);
          xmlDOM.async = false;
          xmlDOM.loadXML(markup);
          xmlDOM.setProperty('SelectionLanguage', 'XPath');
                  
          return xmlDOM;
        }
      }
    }
    catch (ex) {
    }
  
    return null;
  };
}

///////////////////////////////////////////////////////////////////////////////
// Type System Implementation

global.Type = Function;

Type.registerType = function Type$registerType(root, typeName, type) {
    var ns = root;
    var nameParts = typeName.split('.');

    for (var i = 0; i < nameParts.length - 1; i++) {
        var part = nameParts[i];
        var nso = ns[part];
        if (!nso) {
            ns[part] = nso = {};
        }
        ns = nso;
    }
    ns[nameParts[nameParts.length - 1]] = type;
};

Type.__genericCache = {};

Type._makeGenericTypeName = function Type$_makeGenericTypeName(genericType, typeArguments) {
	var result = genericType.__typeName;
	for (var i = 0; i < typeArguments.length; i++)
		result += (i === 0 ? '[' : ',') + typeArguments[i].__typeName;
	result += ']';
	return result;
};

Type.makeGenericType = function Type$makeGenericType(genericType, typeArguments) {
	var name = Type._makeGenericTypeName(genericType, typeArguments);
	return Type.__genericCache[name] || genericType.apply(null, typeArguments);
};

Type.prototype.registerGenericClassInstance = function Type$registerGenericInstance(instance, genericType, typeArguments, baseType, interfaceTypes) {
	var name = Type._makeGenericTypeName(genericType, typeArguments);
	Type.__genericCache[name] = instance;
	instance.__genericTypeDefinition = genericType;
	instance.__typeArguments = typeArguments;
	Type.registerClass(null, name, instance, baseType(), interfaceTypes());
};

Type.registerGenericInterfaceInstance = function Type$registerGenericInstance(instance, genericType, typeArguments, baseInterfaces) {
	var name = Type._makeGenericTypeName(genericType, typeArguments);
	Type.__genericCache[name] = instance;
	instance.__genericTypeDefinition = genericType;
	instance.__typeArguments = typeArguments;
	Type.registerInterface(null, name, instance, baseInterfaces());
};

Type.prototype.get_isGenericTypeDefinition = function Type$get_isGenericTypeDefinition() {
	return this.__isGenericTypeDefinition || false;
};

Type.prototype.getGenericTypeDefinition = function Type$getGenericTypeDefinition() {
	return this.__genericTypeDefinition || null;
};

Type.prototype.get_genericParameterCount = function Type$get_genericParameterCount() {
	return this.__typeArgumentCount || 0;
};

Type.prototype.getGenericArguments = function Type$getGenericArguments() {
    return this.__typeArguments || null;
};

Type.registerClass = function Type$registerClass(root, name, ctor, baseType, interfaceType) {
	if (root)
		Type.registerType(root, name, ctor);

    ctor.prototype.constructor = ctor;
    ctor.__typeName = name;
    ctor.__class = true;
    ctor.__baseType = baseType || Object;
    if (baseType) {
        ctor.setupBase(baseType);
    }

	if (interfaceType instanceof Array) {
		ctor.__interfaces = interfaceType;
	}
	else if (interfaceType) {
        ctor.__interfaces = [];
        for (var i = 4; i < arguments.length; i++) {
            interfaceType = arguments[i];
            ctor.__interfaces.add(interfaceType);
        }
    }
};

Type.registerGenericClass = function Type$registerGenericClass(root, name, ctor, typeArgumentCount) {
	if (root)
		Type.registerType(root, name, ctor);

    ctor.prototype.constructor = ctor;
    ctor.__typeName = name;
    ctor.__class = true;
	ctor.__typeArgumentCount = typeArgumentCount;
	ctor.__isGenericTypeDefinition = true;
    ctor.__baseType = Object;
};

Type.registerInterface = function Type$createInterface(root, name, ctor, baseInterface) {
	if (root)
		Type.registerType(root, name, ctor);

    ctor.__typeName = name;
    ctor.__interface = true;
	if (baseInterface instanceof Array) {
		ctor.__interfaces = baseInterface;
	}
	else if (baseInterface) {
        ctor.__interfaces = [];
        for (var i = 3; i < arguments.length; i++) {
            ctor.__interfaces.add(arguments[i]);
        }
    }
};

Type.registerGenericInterface = function Type$registerGenericClass(root, name, ctor, typeArgumentCount) {
	if (root)
		Type.registerType(root, name, ctor);

    ctor.prototype.constructor = ctor;
    ctor.__typeName = name;
    ctor.__interface = true;;
	ctor.__typeArgumentCount = typeArgumentCount;
	ctor.__isGenericTypeDefinition = true;
};

Type.prototype.registerEnum = function Type$createEnum(root, name, ctor, flags) {
	if (root)
		Type.registerType(root, name, ctor);

    for (var field in ctor.prototype) {
        ctor[field] = ctor.prototype[field];
    }

    ctor.__typeName = name;
    ctor.__enum = true;
    if (flags) {
        ctor.__flags = true;
    }
    ctor.getDefaultValue = ctor.createInstance = function() { return 0; };
    ctor.isInstanceOfType = function(instance) { return typeof(instance) == 'number'; };
};

Type.prototype.setupBase = function Type$setupBase() {
	var baseType = this.__baseType;

	for (var memberName in baseType.prototype) {
		var memberValue = baseType.prototype[memberName];
		if (!this.prototype[memberName]) {
			this.prototype[memberName] = memberValue;
		}
	}
};

if (!Type.prototype.resolveInheritance) {
    // This function is not used by Script#; Visual Studio relies on it
    // for JavaScript IntelliSense support of derived types.
    Type.prototype.resolveInheritance = Type.prototype.setupBase;
};

Type.prototype.get_baseType = function Type$get_baseType() {
    return this.__baseType || null;
};

Type.prototype.get_fullName = function Type$get_fullName() {
    return this.__typeName;
};

Type.prototype.get_name = function Type$get_name() {
    var fullName = this.__typeName;
    var nsIndex = fullName.lastIndexOf('.');
    if (nsIndex > 0) {
        return fullName.substr(nsIndex + 1);
    }
    return fullName;
};

Type.prototype.getInterfaces = function Type$getInterfaces() {
    return this.__interfaces;
};

Type.prototype.isInstanceOfType = function Type$isInstanceOfType(instance) {
    if (ss.isNullOrUndefined(instance)) {
        return false;
    }
    if ((this == Object) || (instance instanceof this)) {
        return true;
    }

    var type = Type.getInstanceType(instance);
    return this.isAssignableFrom(type);
};

Type.isInstanceOfType = function Type$isInstanceOfTypeStatic(instance, type) {
    return instance instanceof type || (type !== Function && type.isInstanceOfType && type.isInstanceOfType(instance));
};

Type.prototype.isAssignableFrom = function Type$isAssignableFrom(type) {
    if ((this == Object) || (this == type)) {
        return true;
    }
    if (this.__class) {
        var baseType = type.__baseType;
        while (baseType) {
            if (this == baseType) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    }
    else if (this.__interface) {
        var interfaces = type.__interfaces;
        if (interfaces && interfaces.contains(this)) {
            return true;
        }

        var baseType = type.__baseType;
        while (baseType) {
            interfaces = baseType.__interfaces;
            if (interfaces && interfaces.contains(this)) {
                return true;
            }
            baseType = baseType.__baseType;
        }
    }
    return false;
};

Type.hasProperty = function Type$hasProperty(instance, name) {
	return typeof(instance['get_' + name]) === 'function' || typeof(instance['set_' + name]) === 'function';
};

Type.prototype.get_isClass = function Type$get_isClass() {
    return (this.__class == true);
};

Type.prototype.get_isEnum = function Type$get_isEnum() {
    return (this.__enum == true);
};

Type.prototype.get_isFlags = function Type$get_isFlags() {
    return ((this.__enum == true) && (this.__flags == true));
};

Type.prototype.get_isInterface = function Type$get_isInterface() {
    return (this.__interface == true);
};

Type.canCast = function Type$canCast(instance, type) {
    return Type.isInstanceOfType(instance, type);
};

Type.safeCast = function Type$safeCast(instance, type) {
    if (Type.isInstanceOfType(instance, type)) {
        return instance;
    }
    return null;
};

Type.cast = function Type$cast(instance, type) {
	if (instance === null)
		return null;
    else if (typeof(instance) === "undefined" || Type.isInstanceOfType(instance, type)) {
        return instance;
    }
    throw 'Cannot cast object to type ' + type.__typeName;
};

Type.getInstanceType = function Type$getInstanceType(instance) {
	if (instance === null)
		throw 'Cannot get type of null';
	if (typeof(instance) === "undefined")
		throw 'Cannot get type of undefined';

    var ctor = null;

    // NOTE: We have to catch exceptions because the constructor
    //       cannot be looked up on native COM objects
    try {
        ctor = instance.constructor;
    }
    catch (ex) {
    }
    if (!ctor || !ctor.__typeName) {
        ctor = Object;
    }
    return ctor;
};

Type.getType = function Type$getType(typeName) {
    if (!typeName) {
        return null;
    }

    if (!Type.__typeCache) {
        Type.__typeCache = {};
    }

    var type = Type.__typeCache[typeName];
    if (!type) {
		var arr = typeName.split(',');
		var type = (arr.length > 1 ? require(arr[1].trim) : global);

		var parts = arr[0].trim().split('.');
		for (var i = 0; i < parts.length; i++) {
			type = type[parts[i]];
			if (!type)
				break;
		}

        Type.__typeCache[typeName] = type || null;
    }
    return type;
};

Type.prototype.getDefaultValue = function Type$getDefaultValue() {
	return null;
};

Type.prototype.createInstance = function Type$createInstance() {
    return new this();
};

Type.parse = function Type$parse(typeName) {
    return Type.getType(typeName);
};

///////////////////////////////////////////////////////////////////////////////
// Object Extensions

Object.__typeName = 'Object';
Object.__baseType = null;
Object.__class = true;

Object.clearKeys = function Object$clearKeys(d) {
    for (var n in d) {
		if (d.hasOwnProperty(n))
			delete d[n];
    }
};

Object.keyExists = function Object$keyExists(d, key) {
    return d[key] !== undefined;
};

if (!Object.keys) {
    Object.keys = function Object$keys(d) {
        var keys = [];
        for (var n in d) {
			if (d.hasOwnProperty(n))
		        keys.push(n);
        }
        return keys;
    };

    Object.getKeyCount = function Object$getKeyCount(d) {
        var count = 0;
        for (var n in d) {
			if (d.hasOwnProperty(n))
		        count++;
        }
        return count;
    };
}
else {
    Object.getKeyCount = function Object$getKeyCount(d) {
        return Object.keys(d).length;
    };
}

Object.getObjectEnumerator = function Object$getObjectEnumerator(d) {
	return new ss_ObjectEnumerator(d);
};

///////////////////////////////////////////////////////////////////////////////
// Boolean Extensions

Boolean.__typeName = 'Boolean';

Boolean.getDefaultValue = Boolean.createInstance = function Boolean$getDefaultValue() {
	return false;
};

Boolean.parse = function Boolean$parse(s) {
    return (s.toLowerCase() == 'true');
};

///////////////////////////////////////////////////////////////////////////////
// Number Extensions

Number.__typeName = 'Number';

Number.getDefaultValue = Number.createInstance = function Number$getDefaultValue() {
	return 0;
};

Number.parse = function Number$parse(s) {
    if (!s || !s.length) {
        return 0;
    }
    if ((s.indexOf('.') >= 0) || (s.indexOf('e') >= 0) ||
        s.endsWith('f') || s.endsWith('F')) {
        return parseFloat(s);
    }
    return parseInt(s, 10);
};

Number.prototype.format = function Number$format(format) {
    if (ss.isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        return this.toString();
    }
    return this._netFormat(format, false);
};

Number.prototype.localeFormat = function Number$format(format) {
    if (ss.isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        return this.toLocaleString();
    }
    return this._netFormat(format, true);
};

Number._commaFormat = function Number$_commaFormat(number, groups, decimal, comma) {
    var decimalPart = null;
    var decimalIndex = number.indexOf(decimal);
    if (decimalIndex > 0) {
        decimalPart = number.substr(decimalIndex);
        number = number.substr(0, decimalIndex);
    }

    var negative = number.startsWith('-');
    if (negative) {
        number = number.substr(1);
    }

    var groupIndex = 0;
    var groupSize = groups[groupIndex];
    if (number.length < groupSize) {
        return decimalPart ? number + decimalPart : number;
    }

    var index = number.length;
    var s = '';
    var done = false;
    while (!done) {
        var length = groupSize;
        var startIndex = index - length;
        if (startIndex < 0) {
            groupSize += startIndex;
            length += startIndex;
            startIndex = 0;
            done = true;
        }
        if (!length) {
            break;
        }
        
        var part = number.substr(startIndex, length);
        if (s.length) {
            s = part + comma + s;
        }
        else {
            s = part;
        }
        index -= length;

        if (groupIndex < groups.length - 1) {
            groupIndex++;
            groupSize = groups[groupIndex];
        }
    }

    if (negative) {
        s = '-' + s;
    }    
    return decimalPart ? s + decimalPart : s;
};

Number.prototype._netFormat = function Number$_netFormat(format, useLocale) {
    var nf = useLocale ? ss_CultureInfo.CurrentCulture.numberFormat : ss_CultureInfo.InvariantCulture.numberFormat;

    var s = '';    
    var precision = -1;
    
    if (format.length > 1) {
        precision = parseInt(format.substr(1));
    }

    var fs = format.charAt(0);
    switch (fs) {
        case 'd': case 'D':
            s = parseInt(Math.abs(this)).toString();
            if (precision != -1) {
                s = s.padLeft(precision, 0x30);
            }
            if (this < 0) {
                s = '-' + s;
            }
            break;
        case 'x': case 'X':
            s = parseInt(Math.abs(this)).toString(16);
            if (fs == 'X') {
                s = s.toUpperCase();
            }
            if (precision != -1) {
                s = s.padLeft(precision, 0x30);
            }
            break;
        case 'e': case 'E':
            if (precision == -1) {
                s = this.toExponential();
            }
            else {
                s = this.toExponential(precision);
            }
            if (fs == 'E') {
                s = s.toUpperCase();
            }
            break;
        case 'f': case 'F':
        case 'n': case 'N':
            if (precision == -1) {
                precision = nf.numberDecimalDigits;
            }
            s = this.toFixed(precision).toString();
            if (precision && (nf.numberDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.numberDecimalSeparator + s.substr(index + 1);
            }
            if ((fs == 'n') || (fs == 'N')) {
                s = Number._commaFormat(s, nf.numberGroupSizes, nf.numberDecimalSeparator, nf.numberGroupSeparator);
            }
            break;
        case 'c': case 'C':
            if (precision == -1) {
                precision = nf.currencyDecimalDigits;
            }
            s = Math.abs(this).toFixed(precision).toString();
            if (precision && (nf.currencyDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.currencyDecimalSeparator + s.substr(index + 1);
            }
            s = Number._commaFormat(s, nf.currencyGroupSizes, nf.currencyDecimalSeparator, nf.currencyGroupSeparator);
            if (this < 0) {
                s = String.format(nf.currencyNegativePattern, s);
            }
            else {
                s = String.format(nf.currencyPositivePattern, s);
            }
            break;
        case 'p': case 'P':
            if (precision == -1) {
                precision = nf.percentDecimalDigits;
            }
            s = (Math.abs(this) * 100.0).toFixed(precision).toString();
            if (precision && (nf.percentDecimalSeparator != '.')) {
                var index = s.indexOf('.');
                s = s.substr(0, index) + nf.percentDecimalSeparator + s.substr(index + 1);
            }
            s = Number._commaFormat(s, nf.percentGroupSizes, nf.percentDecimalSeparator, nf.percentGroupSeparator);
            if (this < 0) {
                s = String.format(nf.percentNegativePattern, s);
            }
            else {
                s = String.format(nf.percentPositivePattern, s);
            }
            break;
    }

    return s;
};

///////////////////////////////////////////////////////////////////////////////
// String Extensions

String.__typeName = 'String';
String.__baseType = 'Object';
String.__class = true;

String.empty = '';

String.compare = function String$compare(s1, s2, ignoreCase) {
    if (ignoreCase) {
        if (s1) {
            s1 = s1.toUpperCase();
        }
        if (s2) {
            s2 = s2.toUpperCase();
        }
    }
    s1 = s1 || '';
    s2 = s2 || '';

    if (s1 == s2) {
        return 0;
    }
    if (s1 < s2) {
        return -1;
    }
    return 1;
};

String.prototype.compareTo = function String$compareTo(s, ignoreCase) {
    return String.compare(this, s, ignoreCase);
};

String.concat = function String$concat() {
    return Array.prototype.join.call(arguments, '');
};

String.prototype.endsWith = function String$endsWith(suffix) {
    if (!suffix.length) {
        return true;
    }
    if (suffix.length > this.length) {
        return false;
    }
    return (this.substr(this.length - suffix.length) == suffix);
};

String.equals = function String$equals1(s1, s2, ignoreCase) {
    return String.compare(s1, s2, ignoreCase) == 0;
};

String._format = function String$_format(format, values, useLocale) {
    if (!String._formatRE) {
        String._formatRE = /(\{[^\}^\{]+\})/g;
    }

    return format.replace(String._formatRE,
                          function(str, m) {
                              var index = parseInt(m.substr(1));
                              var value = values[index + 1];
                              if (ss.isNullOrUndefined(value)) {
                                  return '';
                              }
                              if (value.format) {
                                  var formatSpec = null;
                                  var formatIndex = m.indexOf(':');
                                  if (formatIndex > 0) {
                                      formatSpec = m.substring(formatIndex + 1, m.length - 1);
                                  }
                                  return useLocale ? value.localeFormat(formatSpec) : value.format(formatSpec);
                              }
                              else {
                                  return useLocale ? value.toLocaleString() : value.toString();
                              }
                          });
};

String.format = function String$format(format) {
    return String._format(format, arguments, /* useLocale */ false);
};

String.fromChar = function String$fromChar(ch, count) {
    var s = ch;
    for (var i = 1; i < count; i++) {
        s += ch;
    }
    return s;
};

String.prototype.htmlDecode = function String$htmlDecode() {
    var div = document.createElement('div');
    div.innerHTML = this;
    return div.textContent || div.innerText;
};

String.prototype.htmlEncode = function String$htmlEncode() {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(this));
    return div.innerHTML.replace(/\"/g, '&quot;');
};

String.prototype.indexOfAny = function String$indexOfAny(chars, startIndex, count) {
    var length = this.length;
    if (!length) {
        return -1;
    }

	chars = String.fromCharCode.apply(null, chars);
    startIndex = startIndex || 0;
    count = count || length;

    var endIndex = startIndex + count - 1;
    if (endIndex >= length) {
        endIndex = length - 1;
    }

    for (var i = startIndex; i <= endIndex; i++) {
        if (chars.indexOf(this.charAt(i)) >= 0) {
            return i;
        }
    }
    return -1;
};

String.prototype.insert = function String$insert(index, value) {
    if (!value) {
        return this.valueOf();
    }
    if (!index) {
        return value + this;
    }
    var s1 = this.substr(0, index);
    var s2 = this.substr(index);
    return s1 + value + s2;
};

String.isNullOrEmpty = function String$isNullOrEmpty(s) {
    return !s || !s.length;
};

String.prototype.lastIndexOfAny = function String$lastIndexOfAny(chars, startIndex, count) {
    var length = this.length;
    if (!length) {
        return -1;
    }

	chars = String.fromCharCode.apply(null, chars);
    startIndex = startIndex || length - 1;
    count = count || length;

    var endIndex = startIndex - count + 1;
    if (endIndex < 0) {
        endIndex = 0;
    }

    for (var i = startIndex; i >= endIndex; i--) {
        if (chars.indexOf(this.charAt(i)) >= 0) {
            return i;
        }
    }
    return -1;
};

String.localeFormat = function String$localeFormat(format) {
    return String._format(format, arguments, /* useLocale */ true);
};

String.prototype.padLeft = function String$padLeft(totalWidth, ch) {
    if (this.length < totalWidth) {
        ch = String.fromCharCode(ch || 0x20);
        return String.fromChar(ch, totalWidth - this.length) + this;
    }
    return this.valueOf();
};

String.prototype.padRight = function String$padRight(totalWidth, ch) {
    if (this.length < totalWidth) {
        ch = String.fromCharCode(ch || 0x20);
        return this + String.fromChar(ch, totalWidth - this.length);
    }
    return this.valueOf();
};

String.prototype.remove = function String$remove(index, count) {
    if (!count || ((index + count) > this.length)) {
        return this.substr(0, index);
    }
    return this.substr(0, index) + this.substr(index + count);
};

String.prototype.replaceAll = function String$replaceAll(oldValue, newValue) {
    newValue = newValue || '';
    return this.split(oldValue).join(newValue);
};

String.prototype.startsWith = function String$startsWith(prefix) {
    if (!prefix.length) {
        return true;
    }
    if (prefix.length > this.length) {
        return false;
    }
    return (this.substr(0, prefix.length) == prefix);
};

if (!String.prototype.trim) {
    String.prototype.trim = function String$trim() {
        return this.trimEnd().trimStart();
    };
}

String.prototype.trimEnd = function String$trimEnd() {
    return this.replace(/\s*$/, '');
};

String.prototype.trimStart = function String$trimStart() {
    return this.replace(/^\s*/, '');
};

///////////////////////////////////////////////////////////////////////////////
// Array Extensions

Array.__typeName = 'Array';
Array.__baseType = Object;
Array.__interfaces = [ ss_IEnumerable, ss_ICollection, ss_IList ];
Array.__class = true;

Array.prototype.get_item = function Array$get_item(index) {
	return this[index];
};

Array.prototype.set_item = function Array$set_item(index, value) {
	this[index] = value;
};

Array.prototype.get_count = function Array$get_count() {
	return this.length;
};

Array.prototype.getValue = function Array$getValue(indices) {
	if (indices.length != (this._sizes ? this._sizes.length : 1))
		throw 'Invalid number of indices';

	var idx = indices[0];
	if (this._sizes) {
		for (var i = 1; i < this._sizes.length; i++)
			idx = idx * this._sizes[i] + indices[i];
	}
	var r = this[idx];
	return typeof r !== 'undefined' ? r : this._defvalue;
};

Array.prototype.get = function Array$get() {
	return this.getValue(arguments);
};

Array.prototype.setValue = function Array$setValue(value, indices) {
	if (indices.length != (this._sizes ? this._sizes.length : 1))
		throw 'Invalid number of indices';

	var idx = indices[0];
	if (this._sizes) {
		for (var i = 1; i < this._sizes.length; i++)
			idx = idx * this._sizes[i] + indices[i];
	}
	this[idx] = value;
};

Array.prototype.set = function Array$set() {
	return this.setValue(arguments[arguments.length - 1], Array.prototype.slice.call(arguments, 0, arguments.length - 1));
};

Array.prototype.get_rank = function Array$get_rank() {
	return this._sizes ? this._sizes.length : 1;
};

Array.prototype.getLength = function Array$getLength(dimension) {
	if (dimension >= (this._sizes ? this._sizes.length : 1))
		throw 'Invalid dimension';
	return this._sizes ? this._sizes[dimension] : this.length;
};

Array.prototype.extract = function Array$extract(start, count) {
   if (!ss.isValue(count)) {
       return this.slice(start);
   }
   return this.slice(start, start + count);
};

Array.prototype.add = function Array$add(item) {
    this[this.length] = item;
};

Array.prototype.addRange = function Array$addRange(items) {
	if (items instanceof Array) {
		this.push.apply(this, items);
	}
	else {
		var e = items.getEnumerator();
		try {
			while (e.moveNext()) {
				this.add(e.get_current());
			}
		}
		finally {
			if (ss_IDisposable.isInstanceOfType(e)) {
				Type.cast(e, ss_IDisposable).dispose();
			}
		}
	}
};

Array.prototype.clear = function Array$clear() {
    this.length = 0;
};

Array.prototype.clone = function Array$clone() {
    if (this.length === 1) {
        return [this[0]];
    }
    else {
        return Array.apply(null, this);
    }
};

Array.prototype.contains = function Array$contains(item) {
    var index = this.indexOf(item);
    return (index >= 0);
};

Array.prototype.peekFront = function Array$peekFront(item) {
	if (this.length)
		return this[0];
	throw 'Array is empty';
};

Array.prototype.peekBack = function Array$peekBack(item) {
	if (this.length)
		return this[this.length - 1];
	throw 'Array is empty';
};

if (!Array.prototype.every) {
    Array.prototype.every = function Array$every(callback, instance) {
        var length = this.length;
        for (var i = 0; i < length; i++) {
            if (i in this && !callback.call(instance, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function Array$filter(callback, instance) {
        var length = this.length;    
        var filtered = [];
        for (var i = 0; i < length; i++) {
            if (i in this) {
                var val = this[i];
                if (callback.call(instance, val, i, this)) {
                    filtered.push(val);
                }
            }
        }
        return filtered;
    };
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function Array$forEach(callback, instance) {
        var length = this.length;
        for (var i = 0; i < length; i++) {
            if (i in this) {
                callback.call(instance, this[i], i, this);
            }
        }
    };
}

Array.prototype.getEnumerator = function Array$getEnumerator() {
    return new ss_ArrayEnumerator(this);
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function Array$indexOf(item, startIndex) {
        startIndex = startIndex || 0;
        var length = this.length;
        if (length) {
            for (var index = startIndex; index < length; index++) {
                if (this[index] === item) {
                    return index;
                }
            }
        }
        return -1;
    };
}

Array.prototype.insert = function Array$insert(index, item) {
    this.splice(index, 0, item);
};

Array.prototype.insertRange = function Array$insertRange(index, items) {
	if (items instanceof Array) {
		if (index === 0) {
			this.unshift.apply(this, items);
		}
		else {
			for (var i = 0; i < items.length; i++) {
				this.splice(index + i, 0, items[i]);
			}
		}
	}
	else {
		var e = items.getEnumerator();
		try {
			while (e.moveNext()) {
				this.insert(index, e.get_current());
				index++;
			}
		}
		finally {
			if (ss_IDisposable.isInstanceOfType(e)) {
				Type.cast(e, ss_IDisposable).dispose();
			}
		}
	}
};

if (!Array.prototype.map) {
    Array.prototype.map = function Array$map(callback, instance) {
        var length = this.length;
        var mapped = new Array(length);
        for (var i = 0; i < length; i++) {
            if (i in this) {
                mapped[i] = callback.call(instance, this[i], i, this);
            }
        }
        return mapped;
    };
}

Array.parse = function Array$parse(s) {
    return eval('(' + s + ')');
};

Array.prototype.remove = function Array$remove(item) {
    var index = this.indexOf(item);
    if (index >= 0) {
        this.splice(index, 1);
        return true;
    }
    return false;
};

Array.prototype.removeAt = function Array$removeAt(index) {
    this.splice(index, 1);
};

Array.prototype.removeRange = function Array$removeRange(index, count) {
    this.splice(index, count);
};

if (!Array.prototype.some) {
    Array.prototype.some = function Array$some(callback, instance) {
        var length = this.length;
        for (var i = 0; i < length; i++) {
            if (i in this && callback.call(instance, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
}

Array.toArray = function Array$toArray(obj) {
    return Array.prototype.slice.call(obj);
};

Array.fromEnumerable = function Array$fromEnumerable(enm) {
	var e = enm.getEnumerator(), r = [];
	try {
		while (e.moveNext())
			r.push(e.get_current());
	}
	finally {
		e.dispose();
	}
	return r;
};

Array.multidim = function Array$multidim(defvalue, sizes) {
	var arr = [];
	arr._defvalue = defvalue;
	arr._sizes = [arguments[1]];
	var length = arguments[1];
	for (var i = 2; i < arguments.length; i++) {
		length *= arguments[i];
		arr._sizes[i - 1] = arguments[i];
	}
	arr.length = length;
	return arr;
};

///////////////////////////////////////////////////////////////////////////////
// RegExp Extensions

RegExp.__typeName = 'RegExp';
RegExp.__baseType = Object;
RegExp.__class = true;

///////////////////////////////////////////////////////////////////////////////
// Date Extensions

Date.__typeName = 'Date';
Date.__baseType = 'Object';

Date.getDefaultValue = Date.createInstance = function Date$getDefaultValue() {
	return new Date(0);
};

Date.get_now = function Date$get_now() {
    return new Date();
};

Date.get_today = function Date$get_today() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

Date.areEqual = function Date$areEqual(a, b) {
    if (!ss.isValue(a))
        return !ss.isValue(b);
    else if (!ss.isValue(b))
        return false;
    else
        return a.valueOf() === b.valueOf();
};

Date.areNotEqual = function Date$areNotEqual(a, b) {
    return !Date.areEqual(a, b);
};

Date.prototype.format = function Date$format(format) {
    if (ss.isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        return this.toString();
    }
    if (format == 'id') {
        return this.toDateString();
    }
    if (format == 'it') {
        return this.toTimeString();
    }

    return this._netFormat(format, false);
};

Date.prototype.localeFormat = function Date$localeFormat(format) {
    if (ss.isNullOrUndefined(format) || (format.length == 0) || (format == 'i')) {
        return this.toLocaleString();
    }
    if (format == 'id') {
        return this.toLocaleDateString();
    }
    if (format == 'it') {
        return this.toLocaleTimeString();
    }

    return this._netFormat(format, true);
};

Date.prototype._netFormat = function Date$_netFormat(format, useLocale) {
    var dt = this;
    var dtf = useLocale ? ss_CultureInfo.CurrentCulture.dateFormat : ss_CultureInfo.InvariantCulture.dateFormat;

    if (format.length == 1) {
        switch (format) {
            case 'f': format = dtf.longDatePattern + ' ' + dtf.shortTimePattern; break;
            case 'F': format = dtf.dateTimePattern; break;

            case 'd': format = dtf.shortDatePattern; break;
            case 'D': format = dtf.longDatePattern; break;

            case 't': format = dtf.shortTimePattern; break;
            case 'T': format = dtf.longTimePattern; break;

            case 'g': format = dtf.shortDatePattern + ' ' + dtf.shortTimePattern; break;
            case 'G': format = dtf.shortDatePattern + ' ' + dtf.longTimePattern; break;

            case 'R': case 'r':
                dtf = ss_CultureInfo.InvariantCulture.dateFormat;
                format = dtf.gmtDateTimePattern;
                break;
            case 'u': format = dtf.universalDateTimePattern; break;
            case 'U':
                format = dtf.dateTimePattern;
                dt = new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(),
                              dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds());
                break;

            case 's': format = dtf.sortableDateTimePattern; break;
        }
    }

    if (format.charAt(0) == '%') {
        format = format.substr(1);
    }

    if (!Date._formatRE) {
        Date._formatRE = /'.*?[^\\]'|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z/g;
    }

    var re = Date._formatRE;
    var sb = new ss_StringBuilder();

    re.lastIndex = 0;
    while (true) {
        var index = re.lastIndex;
        var match = re.exec(format);

        sb.append(format.slice(index, match ? match.index : format.length));
        if (!match) {
            break;
        }

        var fs = match[0];
        var part = fs;
        switch (fs) {
            case 'dddd':
                part = dtf.dayNames[dt.getDay()];
                break;
            case 'ddd':
                part = dtf.shortDayNames[dt.getDay()];
                break;
            case 'dd':
                part = dt.getDate().toString().padLeft(2, 0x30);
                break;
            case 'd':
                part = dt.getDate();
                break;
            case 'MMMM':
                part = dtf.monthNames[dt.getMonth()];
                break;
            case 'MMM':
                part = dtf.shortMonthNames[dt.getMonth()];
                break;
            case 'MM':
                part = (dt.getMonth() + 1).toString().padLeft(2, 0x30);
                break;
            case 'M':
                part = (dt.getMonth() + 1);
                break;
            case 'yyyy':
                part = dt.getFullYear();
                break;
            case 'yy':
                part = (dt.getFullYear() % 100).toString().padLeft(2, 0x30);
                break;
            case 'y':
                part = (dt.getFullYear() % 100);
                break;
            case 'h': case 'hh':
                part = dt.getHours() % 12;
                if (!part) {
                    part = '12';
                }
                else if (fs == 'hh') {
                    part = part.toString().padLeft(2, 0x30);
                }
                break;
            case 'HH':
                part = dt.getHours().toString().padLeft(2, 0x30);
                break;
            case 'H':
                part = dt.getHours();
                break;
            case 'mm':
                part = dt.getMinutes().toString().padLeft(2, 0x30);
                break;
            case 'm':
                part = dt.getMinutes();
                break;
            case 'ss':
                part = dt.getSeconds().toString().padLeft(2, 0x30);
                break;
            case 's':
                part = dt.getSeconds();
                break;
            case 't': case 'tt':
                part = (dt.getHours() < 12) ? dtf.amDesignator : dtf.pmDesignator;
                if (fs == 't') {
                    part = part.charAt(0);
                }
                break;
            case 'fff':
                part = dt.getMilliseconds().toString().padLeft(3, 0x30);
                break;
            case 'ff':
                part = dt.getMilliseconds().toString().padLeft(3).substr(0, 2);
                break;
            case 'f':
                part = dt.getMilliseconds().toString().padLeft(3).charAt(0);
                break;
            case 'z':
                part = dt.getTimezoneOffset() / 60;
                part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part));
                break;
            case 'zz': case 'zzz':
                part = dt.getTimezoneOffset() / 60;
                part = ((part >= 0) ? '-' : '+') + Math.floor(Math.abs(part)).toString().padLeft(2, 0x30);
                if (fs == 'zzz') {
                    part += dtf.timeSeparator + Math.abs(dt.getTimezoneOffset() % 60).toString().padLeft(2, 0x30);
                }
                break;
            default:
                if (part.charAt(0) == '\'') {
                    part = part.substr(1, part.length - 2).replace(/\\'/g, '\'');
                }
                break;
        }
        sb.append(part);
    }

    return sb.toString();
};

Date.parseDate = function Date$parse(s) {
    // Date.parse returns the number of milliseconds
    // so we use that to create an actual Date instance
    return new Date(Date.parse(s));
};

Date._parseExact = function Date$_parseExact(val, format, culture, utc) {
    culture = culture || ss_CultureInfo.CurrentCulture;
	var AM = culture.amDesignator, PM = culture.pmDesignator;

	var _isInteger = function(val) {
		var digits="1234567890";
		for (var i=0; i < val.length; i++) {
			if (digits.indexOf(val.charAt(i))==-1) {
				return false;
			}
		}
		return true;
	};

	var _getInt = function(str,i,minlength,maxlength) {
		for (var x=maxlength; x>=minlength; x--) {
			var token=str.substring(i,i+x);
			if (token.length < minlength) {
				return null;
			}
			if (_isInteger(token)) {
				return token;
			}
		}
		return null;
	};

	val = val + "";
	format = format + "";
	var i_val = 0;
	var i_format = 0;
	var c = "";
	var token = "";

	var year = 0, month = 1, date = 1, hh = 0, mm = 0, _ss = 0, ampm = "";
		
	while (i_format < format.length) {
		// Get next token from format string
		c = format.charAt(i_format);
		token = "";
		while ((format.charAt(i_format) == c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
		}
		// Extract contents of value based on format token
		if (token=="yyyy" || token=="yy" || token=="y") {
			if (token == "yyyy")
				year = _getInt(val, i_val, 4, 4);
			if (token == "yy")
				year = _getInt(val, i_val, 2, 2);
			if (token == "y")
				year = _getInt(val, i_val, 2, 4);

			if (year == null)
				return null;

			i_val += year.length;
			if (year.length == 2) {
				if (year > 30) {
					year = 1900 + (year-0);
				}
				else {
					year = 2000 + (year-0);
				}
			}
		}
		else if (token == "MM" || token == "M") {
			month = _getInt(val, i_val, token.length, 2);
			if (month == null || (month < 1) || (month > 12))
				return null;
			i_val += month.length;
		}
		else if (token=="dd"||token=="d") {
			date = _getInt(val, i_val, token.length, 2);
			if (date == null || (date < 1) || (date > 31))
				return null;
			i_val += date.length;
		}
		else if (token=="hh"||token=="h") {
			hh = _getInt(val, i_val, token.length, 2);
			if (hh == null || (hh < 1) || (hh > 12))
				return null;
			i_val += hh.length;
		}
		else if (token=="HH"||token=="H") {
			hh = _getInt(val, i_val, token.length, 2);
			if (hh == null || (hh < 0) || (hh > 23))
				return null;
			i_val += hh.length;
		}
		else if (token == "mm" || token == "m") {
			mm = _getInt(val, i_val, token.length, 2);
			if (mm == null || (mm < 0) || (mm > 59))
				return null;
			i_val += mm.length;
		}
		else if (token == "ss" || token == "s") {
			_ss = _getInt(val, i_val, token.length, 2);
			if (_ss == null || (_ss < 0) || (_ss > 59))
				return null;
			i_val += _ss.length;
		}
		else if (token == "t") {
			if (val.substring(i_val, i_val + 1).toLowerCase() == AM.charAt(0).toLowerCase())
				ampm = AM;
			else if (val.substring(i_val, i_val + 1).toLowerCase() == PM.charAt(0).toLowerCase())
				ampm = PM;
			else
				return null;
			i_val += 1;
		}
		else if (token == "tt") {
			if (val.substring(i_val, i_val + 2).toLowerCase() == AM.toLowerCase())
				ampm = AM;
			else if (val.substring(i_val,i_val+2).toLowerCase() == PM.toLowerCase())
				ampm = PM;
			else
				return null;
			i_val += 2;
		}
		else {
			if (val.substring(i_val, i_val + token.length) != token)
				return null;
			else
				i_val += token.length;
		}
	}
	// If there are any trailing characters left in the value, it doesn't match
	if (i_val != val.length)
		return null;

	// Is date valid for month?
	if (month == 2) {
		// Check for leap year
		if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
			if (date > 29)
				return null;
		}
		else if (date > 28)
			return null;
	}
	if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
		if (date > 30) {
			return null;
		}
	}
	// Correct hours value
	if (hh < 12 && ampm == PM) {
		hh = hh - 0 + 12;
	}
	else if (hh > 11 && ampm == AM) {
		hh -= 12;
	}

    if (utc)
	    return new Date(Date.UTC(year, month - 1, date, hh, mm, _ss));
    else
        return new Date(year, month - 1, date, hh, mm, _ss);
};

Date.parseExact = function Date$parseExact(val, format, culture) {
    return Date._parseExact(val, format, culture, false);
};

Date.parseExactUTC = function Date$parseExactUTC(val, format, culture) {
    return Date._parseExact(val, format, culture, true);
};

///////////////////////////////////////////////////////////////////////////////
// Error Extensions

Error.__typeName = 'Error';
Error.__baseType = Object;

Error.prototype.popStackFrame = function Error$popStackFrame() {
    if (ss.isNullOrUndefined(this.stack) ||
        ss.isNullOrUndefined(this.fileName) ||
        ss.isNullOrUndefined(this.lineNumber)) {
        return;
    }

    var stackFrames = this.stack.split('\n');
    var currentFrame = stackFrames[0];
    var pattern = this.fileName + ':' + this.lineNumber;
    while (!ss.isNullOrUndefined(currentFrame) &&
           currentFrame.indexOf(pattern) === -1) {
        stackFrames.shift();
        currentFrame = stackFrames[0];
    }

    var nextFrame = stackFrames[1];
    if (isNullOrUndefined(nextFrame)) {
        return;
    }

    var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
    if (ss.isNullOrUndefined(nextFrameParts)) {
        return;
    }

    stackFrames.shift();
    this.stack = stackFrames.join("\n");
    this.fileName = nextFrameParts[1];
    this.lineNumber = parseInt(nextFrameParts[2]);
};

Error.createError = function Error$createError(message, errorInfo, innerException) {
    var e = new Error(message);
    if (errorInfo) {
        for (var v in errorInfo) {
            e[v] = errorInfo[v];
        }
    }
    if (innerException) {
        e.innerException = innerException;
    }

    e.popStackFrame();
    return e;
};

///////////////////////////////////////////////////////////////////////////////
// Function Extensions

Function.__typeName = 'Function';
Function.__baseType = Object;
Function.__class = true;

Function.empty = function () { };

Function._contains = function Function$_contains(targets, object, method) {
    for (var i = 0; i < targets.length; i += 2) {
        if (targets[i] === object && targets[i + 1] === method) {
            return true;
        }
    }
    return false;
};

Function._mkdel = function Function$_mkdel(targets) {
    var delegate = function() {
        if (targets.length == 2) {
            return targets[1].apply(targets[0], arguments);
        }
        else {
            var clone = targets.clone();
            for (var i = 0; i < clone.length; i += 2) {
                if (Function._contains(targets, clone[i], clone[i + 1])) {
                    clone[i + 1].apply(clone[i], arguments);
                }
            }
            return null;
        }
    };
    delegate._targets = targets;

    return delegate;
};

Function.mkdel = function Function$mkdel(object, method) {
    if (!object) {
        return method;
    }
    return Function._mkdel([object, method]);
};

Function.combine = function Function$combine(delegate1, delegate2) {
    if (!delegate1) {
        if (!delegate2._targets) {
            return Function.mkdel(null, delegate2);
        }
        return delegate2;
    }
    if (!delegate2) {
        if (!delegate1._targets) {
            return Function.mkdel(null, delegate1);
        }
        return delegate1;
    }

    var targets1 = delegate1._targets ? delegate1._targets : [null, delegate1];
    var targets2 = delegate2._targets ? delegate2._targets : [null, delegate2];

    return Function._mkdel(targets1.concat(targets2));
};

Function.remove = function Function$remove(delegate1, delegate2) {
    if (!delegate1 || (delegate1 === delegate2)) {
        return null;
    }
    if (!delegate2) {
        return delegate1;
    }

    var targets = delegate1._targets;
    var object = null;
    var method;
    if (delegate2._targets) {
        object = delegate2._targets[0];
        method = delegate2._targets[1];
    }
    else {
        method = delegate2;
    }

    for (var i = 0; i < targets.length; i += 2) {
        if ((targets[i] === object) && (targets[i + 1] === method)) {
            if (targets.length == 2) {
                return null;
            }
            targets.splice(i, 2);
            return Function._mkdel(targets);
        }
    }

    return delegate1;
};

Function.clone = function Function$clone(source) {
	return source._targets ? Function._mkdel(source._targets) : function() { return source.apply(this, arguments); };
};

Function.thisFix = function Function$thisFix(source) {
    return function() {
        var x = [this];
        for(var i = 0; i < arguments.length; i++)
            x.push(arguments[i]);
        return source.apply(source, x);
    };
};

///////////////////////////////////////////////////////////////////////////////
// Debug Extensions

ss.Debug = global.Debug || function() {};
ss.Debug.__typeName = 'Debug';

if (!ss.Debug.writeln) {
    ss.Debug.writeln = function Debug$writeln(text) {
        if (global.console) {
            if (global.console.debug) {
                global.console.debug(text);
                return;
            }
            else if (global.console.log) {
                global.console.log(text);
                return;
            }
        }
        else if (global.opera &&
            global.opera.postError) {
            global.opera.postError(text);
            return;
        }
    }
};

ss.Debug._fail = function Debug$_fail(message) {
    ss.Debug.writeln(message);
    eval('debugger;');
};

ss.Debug.assert = function Debug$assert(condition, message) {
    if (!condition) {
        message = 'Assert failed: ' + message;
        if (confirm(message + '\r\n\r\nBreak into debugger?')) {
            ss.Debug._fail(message);
        }
    }
};

ss.Debug.fail = function Debug$fail(message) {
    ss.Debug._fail(message);
};

///////////////////////////////////////////////////////////////////////////////
// Enum

var ss_Enum = function Enum$() {
};
Type.registerClass(global, 'ss.Enum', ss_Enum);

ss_Enum.parse = function Enum$parse(enumType, s) {
	var values = enumType.prototype;
	if (!enumType.__flags) {
		for (var f in values) {
			if (f === s) {
				return values[f];
			}
		}
	}
	else {
		var parts = s.split('|');
		var value = 0;
		var parsed = true;

		for (var i = parts.length - 1; i >= 0; i--) {
			var part = parts[i].trim();
			var found = false;

			for (var f in values) {
				if (f === part) {
					value |= values[f];
					found = true;
					break;
				}
			}
			if (!found) {
				parsed = false;
				break;
			}
		}

		if (parsed) {
			return value;
		}
	}
	throw 'Invalid Enumeration Value';
};

ss_Enum.toString = function  Enum$toString(enumType, value) {
	var values = enumType.prototype;
	if (!enumType.__flags || (value === 0)) {
		for (var i in values) {
			if (values[i] === value) {
				return i;
			}
		}
		throw 'Invalid Enumeration Value';
	}
	else {
		var parts = [];
		for (var i in values) {
			if (values[i] & value) {
				parts.add(i);
			}
		}
		if (!parts.length) {
			throw 'Invalid Enumeration Value';
		}
		return parts.join(' | ');
	}
};

///////////////////////////////////////////////////////////////////////////////
// CultureInfo

var ss_CultureInfo = function CultureInfo$(name, numberFormat, dateFormat) {
    this.name = name;
    this.numberFormat = numberFormat;
    this.dateFormat = dateFormat;
};
Type.registerClass(global, 'ss.CultureInfo', ss_CultureInfo);

ss_CultureInfo.InvariantCulture = new ss_CultureInfo('en-US',
    {
        naNSymbol: 'NaN',
        negativeSign: '-',
        positiveSign: '+',
        negativeInfinityText: '-Infinity',
        positiveInfinityText: 'Infinity',
        
        percentSymbol: '%',
        percentGroupSizes: [3],
        percentDecimalDigits: 2,
        percentDecimalSeparator: '.',
        percentGroupSeparator: ',',
        percentPositivePattern: '{0} %',
        percentNegativePattern: '-{0} %',

        currencySymbol:'$',
        currencyGroupSizes: [3],
        currencyDecimalDigits: 2,
        currencyDecimalSeparator: '.',
        currencyGroupSeparator: ',',
        currencyNegativePattern: '(${0})',
        currencyPositivePattern: '${0}',

        numberGroupSizes: [3],
        numberDecimalDigits: 2,
        numberDecimalSeparator: '.',
        numberGroupSeparator: ','
    },
    {
        amDesignator: 'AM',
        pmDesignator: 'PM',

        dateSeparator: '/',
        timeSeparator: ':',

        gmtDateTimePattern: 'ddd, dd MMM yyyy HH:mm:ss \'GMT\'',
        universalDateTimePattern: 'yyyy-MM-dd HH:mm:ssZ',
        sortableDateTimePattern: 'yyyy-MM-ddTHH:mm:ss',
        dateTimePattern: 'dddd, MMMM dd, yyyy h:mm:ss tt',

        longDatePattern: 'dddd, MMMM dd, yyyy',
        shortDatePattern: 'M/d/yyyy',

        longTimePattern: 'h:mm:ss tt',
        shortTimePattern: 'h:mm tt',

        firstDayOfWeek: 0,
        dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        shortDayNames: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        minimizedDayNames: ['Su','Mo','Tu','We','Th','Fr','Sa'],

        monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December',''],
        shortMonthNames: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','']
    });
ss_CultureInfo.CurrentCulture = ss_CultureInfo.InvariantCulture;

///////////////////////////////////////////////////////////////////////////////
// IEnumerator

var ss_IEnumerator = function IEnumerator$() { };
ss_IEnumerator.prototype = {
    get_current: null,
    moveNext: null,
    reset: null
};

Type.registerInterface(global, 'ss.IEnumerator', ss_IEnumerator, ss_IDisposable);

///////////////////////////////////////////////////////////////////////////////
// IEnumerable

var ss_IEnumerable = function IEnumerable$() { };
ss_IEnumerable.prototype = {
    getEnumerator: null
};

ss_IEnumerable.isAssignableFrom = function IEnumerable$isAssignableFrom(type) {
	if (type == Array)
		return true;
	else
		return Type.prototype.isAssignableFrom.call(this, type);
};

Type.registerInterface(global, 'ss.IEnumerable', ss_IEnumerable);

///////////////////////////////////////////////////////////////////////////////
// IEnumerable

var ss_ICollection = function ICollection$() { };
ss_ICollection.prototype = {
	get_count: null,
	add: null,
	clear: null,
	contains: null,
	remove: null
};

ss_ICollection.isAssignableFrom = function ICollection$isAssignableFrom(type) {
	if (type == Array)
		return true;
	else
		return Type.prototype.isAssignableFrom.call(this, type);
};

Type.registerInterface(global, 'ss.ICollection', ss_IEnumerable);

///////////////////////////////////////////////////////////////////////////////
// Nullable

var ss_Nullable = function Nullable$() {
};

Type.registerClass(global, 'ss.Nullable', ss_Nullable);

ss_Nullable.unbox = function Nullable$unbox(instance) {
	if (!ss.isValue(instance))
		throw 'Instance is null';
	return instance;
};

ss_Nullable.eq = function Nullable$eq(a, b) {
	return !ss.isValue(a) ? !ss.isValue(b) : (a === b);
};

ss_Nullable.ne = function Nullable$eq(a, b) {
	return !ss.isValue(a) ? ss.isValue(b) : (a !== b);
};

ss_Nullable.le = function Nullable$le(a, b) {
	return ss.isValue(a) && ss.isValue(b) && a <= b;
};

ss_Nullable.ge = function Nullable$ge(a, b) {
	return ss.isValue(a) && ss.isValue(b) && a >= b;
};

ss_Nullable.lt = function Nullable$lt(a, b) {
	return ss.isValue(a) && ss.isValue(b) && a < b;
};

ss_Nullable.gt = function Nullable$gt(a, b) {
	return ss.isValue(a) && ss.isValue(b) && a > b;
};

ss_Nullable.sub = function Nullable$sub(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a - b : null;
};

ss_Nullable.add = function Nullable$add(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a + b : null;
};

ss_Nullable.mod = function Nullable$mod(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a % b : null;
};

ss_Nullable.div = function Nullable$divf(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a / b : null;
};

ss_Nullable.mul = function Nullable$mul(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a * b : null;
};

ss_Nullable.band = function Nullable$band(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a & b : null;
};

ss_Nullable.bor = function Nullable$bor(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a | b : null;
};

ss_Nullable.xor = function Nullable$xor(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a ^ b : null;
};

ss_Nullable.shl = function Nullable$shl(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a << b : null;
};

ss_Nullable.srs = function Nullable$srs(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a >> b : null;
};

ss_Nullable.sru = function Nullable$sru(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? a >>> b : null;
};

ss_Nullable.and = function Nullable$and(a, b) {
	if (a === true && b === true)
		return true;
	else if (a === false || b === false)
		return false;
	else
		return null;
};

ss_Nullable.or = function Nullable$or(a, b) {
	if (a === true || b === true)
		return true;
	else if (a === false && b === false)
		return false;
	else
		return null;
};

ss_Nullable.not = function Nullable$not(a) {
	return ss.isValue(a) ? !a : null;
};

ss_Nullable.neg = function Nullable$neg(a) {
	return ss.isValue(a) ? -a : null;
};

ss_Nullable.pos = function Nullable$pos(a) {
	return ss.isValue(a) ? +a : null;
};

ss_Nullable.cpl = function Nullable$cpl(a) {
	return ss.isValue(a) ? ~a : null;
};

///////////////////////////////////////////////////////////////////////////////
// IEnumerable

var ss_IList = function IList$() { };
ss_IList.prototype = {
	get_item: null,
	set_item: null,
	indexOf: null,
	insert: null,
	removeAt: null
};

ss_IList.isAssignableFrom = function IList$isAssignableFrom(type) {
	if (type == Array)
		return true;
	else
		return Type.prototype.isAssignableFrom.call(this, type);
};

Type.registerInterface(global, 'ss.IList', ss_IList, ss_ICollection, ss_IEnumerable);

///////////////////////////////////////////////////////////////////////////////
// IDictionary

var ss_IDictionary = function IDictionary$() { };
ss_IDictionary.prototype = {
	get_item: null,
	set_item: null,
	get_keys: null,
	get_values: null,
	containsKey: null,
	add: null,
	remove: null,
	tryGetValue: null
};

Type.registerInterface(global, 'ss.IDictionary', ss_IDictionary, [ss_IEnumerable]);

///////////////////////////////////////////////////////////////////////////////
// Int32

var ss_Int32 = function Int32$() { };

Type.registerClass(global, 'ss.Int32', ss_Int32);
ss_Int32.__class = false;

ss_Int32.isInstanceOfType = function Int32$isInstanceOfType(instance) {
	return typeof(instance) === 'number' && isFinite(instance) && Math.round(instance, 0) == instance;
};

ss_Int32.getDefaultValue = ss_Int32.createInstance = function Int32$getDefaultValue() {
	return 0;
};

ss_Int32.div = function Int32$div(a, b) {
	return ss.isValue(a) && ss.isValue(b) ? (a / b) | 0 : null;
};

ss_Int32.trunc = function Int32$trunc(n) {
	return ss.isValue(n) ? n | 0 : null;
};

///////////////////////////////////////////////////////////////////////////////
// MutableDateTime

var ss_JsDate = function JsDate$() { };

Type.registerClass(global, 'ss.JsDate', ss_JsDate);

ss_JsDate.createInstance = function JsDate$createInstance() {
	return new Date();
};

ss_JsDate.isInstanceOfType = function JsDate$isInstanceOfType(instance) {
	return instance instanceof Date;
};

///////////////////////////////////////////////////////////////////////////////
// ArrayEnumerator

var ss_ArrayEnumerator = function ArrayEnumerator$(array) {
    this._array = array;
    this._index = -1;
};
ss_ArrayEnumerator.prototype = {
    moveNext: function ArrayEnumerator$moveNext() {
        this._index++;
        return (this._index < this._array.length);
    },
    reset: function ArrayEnumerator$reset() {
        this._index = -1;
    },
	get_current: function ArrayEnumerator$get_current() {
		if (this._index < 0 || this._index >= this._array.length)
			throw 'Invalid operation';
		return this._array[this._index];
	},
    dispose: function ArrayEnumerator$dispose() {
    }
};

Type.registerClass(global, 'ss.ArrayEnumerator', ss_ArrayEnumerator, null, [ss_IEnumerator, ss_IDisposable]);

///////////////////////////////////////////////////////////////////////////////
// ObjectEnumerator

var ss_ObjectEnumerator = function ObjectEnumerator$(o) {
    this._keys = Object.keys(o);
    this._index = -1;
	this._object = o;
};
ss_ObjectEnumerator.prototype = {
    moveNext: function ObjectEnumerator$moveNext() {
        this._index++;
        return (this._index < this._keys.length);
    },
    reset: function ObjectEnumerator$reset() {
        this._index = -1;
    },
	get_current: function ObjectEnumerator$get_current() {
		if (this._index < 0 || this._index >= this._keys.length)
			throw 'Invalid operation';
		var k = this._keys[this._index];
		return { key: k, value: this._object[k] };
	},
    dispose: function ObjectEnumerator$dispose() {
    }
};

Type.registerClass(global, 'ss.ObjectEnumerator', ss_ObjectEnumerator, null, [ss_IEnumerator, ss_IDisposable]);

///////////////////////////////////////////////////////////////////////////////
// Dictionary
var ss_Dictionary$2 = function Dictionary$2$(TKey, TValue) {
	var $type = function(o) {
		this._o = {};
		if (ss_IDictionary.isInstanceOfType(o)) {
			var e = Type.cast(o, ss_IDictionary).getEnumerator();
			try {
				while (e.moveNext()) {
					var c = e.get_current();
					this._o[c.key] = c.value;
				}
			}
			finally {
				if (ss_IDisposable.isInstanceOfType(e)) {
					Type.cast(e, ss_IDisposable).dispose();
				}
			}
		}
		else if (o) {
			var keys = Object.keys(o);
			for (var i = 0; i < keys.length; i++) {
				this._o[keys[i]] = o[keys[i]];
			}
		}
	};
	$type.prototype = {
		get_count: function Dictionary$2$get_count() {
			return Object.getKeyCount(this._o);
		},
		get_keys: function Dictionary$2$get_keys() {
			return Object.keys(this._o);
		},
		get_values: function Dictionary$2$get_values() {
			var result = [];
			var keys = Object.keys(this._o);
			for (var i = 0; i < keys.length; i++)
				result.push(this._o[keys[i]]);
			return result;
		},
		get_item: function Dictionary$2$get_item(key) {
			if (!Object.keyExists(this._o, key))
				throw 'Key ' + key + ' does not exist.';
			return this._o[key];
		},
		set_item: function Dictionary$2$set_item(key, value) {
			this._o[key] = value;
		},
		add: function Dictionary$2$add(key, value) {
			if (Object.keyExists(this._o, key))
				throw 'Key ' + key + ' already exists.';
			this._o[key] = value;
		},
		getEnumerator: function Dictionary$2$getEnumerator() {
			return new ss_ObjectEnumerator(this._o);
		},
		remove: function Dictionary$2$remove(key, value) {
			var result = Object.keyExists(this._o, key);
			delete this._o[key];
			return result;
		},
		containsKey: function Dictionary$2$containsKey(key) {
			return Object.keyExists(this._o, key);
		},
		tryGetValue: function Dictionary$2$tryGetValue(key, value) {
			if (Object.keyExists(this._o, key)) {
				value.$ = this._o[key];
				return true;
			}
			else {
				value.$ = TValue.getDefaultValue();
				return false;
			}
		},
		clear: function Dictionary$2$clear() {
			Object.clearKeys(this._o);
		}
	};
	$type.registerGenericClassInstance($type, ss_Dictionary$2, [TKey, TValue], function() { return null }, function() { return [ ss_IDictionary, ss_IEnumerable ] });
	return $type;
};
Type.registerGenericClass(global, 'ss.Dictionary$2', ss_Dictionary$2, 2);

///////////////////////////////////////////////////////////////////////////////
// IDisposable

var ss_IDisposable = function IDisposable$() { };
ss_IDisposable.prototype = {
    dispose: null
};
Type.registerInterface(global, 'ss.IDisposable', ss_IDisposable);

///////////////////////////////////////////////////////////////////////////////
// StringBuilder

var ss_StringBuilder = function StringBuilder$(s) {
    this._parts = ss.isNullOrUndefined(s) || s === '' ? [] : [s];
    this.isEmpty = this._parts.length == 0;
}
ss_StringBuilder.prototype = {
    append: function StringBuilder$append(s) {
        if (!ss.isNullOrUndefined(s) && s !== '') {
            this._parts.add(s);
            this.isEmpty = false;
        }
        return this;
    },

	appendChar: function StringBuilder$appendChar(c) {
		return this.append(String.fromCharCode(c));
	},

    appendLine: function StringBuilder$appendLine(s) {
        this.append(s);
        this.append('\r\n');
        this.isEmpty = false;
        return this;
    },

	appendLineChar: function StringBuilder$appendLineChar(c) {
		return this.appendLine(String.fromCharCode(c));
	},

    clear: function StringBuilder$clear() {
        this._parts = [];
        this.isEmpty = true;
    },

    toString: function StringBuilder$toString() {
        return this._parts.join('');
    }
};

Type.registerClass(global, 'ss.StringBuilder', ss_StringBuilder);

///////////////////////////////////////////////////////////////////////////////
// EventArgs

var ss_EventArgs = function EventArgs$() {
}
Type.registerClass(global, 'ss.EventArgs', ss_EventArgs);

ss_EventArgs.Empty = new ss_EventArgs();

///////////////////////////////////////////////////////////////////////////////
// Exception

var ss_Exception = function Exception$(message, innerException) {
	this._message = message || null;
	this._innerException = innerException || null;
}
Type.registerClass(global, 'ss.Exception', ss_Exception);

ss_Exception.prototype = {
	get_message: function Exception$get_message() {
		return this._message;
	},
	get_innerException: function Exception$get_innerException() {
		return this._innerException;
	}
};

ss_Exception.wrap = function Exception$wrap(o) {
	if (ss_Exception.isInstanceOfType(o)) {
		return o;
	}
	else if (o instanceof Error) {
		return new ss_JsErrorException(o);
	}
	else {
		return new ss_Exception(o.toString());
	}
};

////////////////////////////////////////////////////////////////////////////////
// NotSupportedException

var ss_NotSupportedException = function NotSupportedException$(message, innerException) {
	ss_Exception.call(this, message, innerException);
};
Type.registerClass(global, 'ss.NotSupportedException', ss_NotSupportedException, ss_Exception);

////////////////////////////////////////////////////////////////////////////////
// AggregateException

var ss_AggregateException = function AggregateException$(message, innerExceptions) {
	if (typeof(message) !== 'string') {
		innerExceptions = message;
		message = 'One or more errors occurred.';
	}
	innerExceptions = ss.isValue(innerExceptions) ? Array.fromEnumerable(innerExceptions) : null;

	ss_Exception.call(this, message, innerExceptions && innerExceptions.length ? innerExceptions[0] : null);
	this._innerExceptions = innerExceptions;
};
ss_AggregateException.prototype = {
	get_innerExceptions: function AggregateException$get_innerExceptions() {
		return this._innerExceptions;
	}
};
Type.registerClass(global, 'ss.AggregateException', ss_AggregateException, ss_Exception);

////////////////////////////////////////////////////////////////////////////////
// PromiseException

var ss_PromiseException = function PromiseException(args) {
	ss_Exception.call(this, args[0] ? args[0].toString() : 'An error occurred');
	this._arguments = args.clone();
};
ss_PromiseException.prototype = {
	get_arguments: function PromiseException$get_arguments() {
		return this._arguments;
	}
};
Type.registerClass(global, 'ss.PromiseException', ss_PromiseException, ss_Exception);

////////////////////////////////////////////////////////////////////////////////
// JsErrorException

var ss_JsErrorException = function JsErrorException$(error) {
	ss_Exception.call(this, error.message);
	this._error = error;
};
ss_JsErrorException.prototype = {
	get_error: function JsErrorException$get_error() {
		return this._error;
	}
};
Type.registerClass(global, 'ss.JsErrorException', ss_JsErrorException, ss_Exception);

///////////////////////////////////////////////////////////////////////////////
// IteratorBlockEnumerable

var ss_IteratorBlockEnumerable = function IteratorBlockEnumerable$(getEnumerator, $this) {
    this._getEnumerator = getEnumerator;
    this._this = $this;
};

ss_IteratorBlockEnumerable.prototype = {
    getEnumerator: function IteratorBlockEnumerable$getEnumerator() {
        return this._getEnumerator.call(this._this);
    }
};

Type.registerClass(global, 'ss.IteratorBlockEnumerable', ss_IteratorBlockEnumerable, null, ss_IEnumerable);

///////////////////////////////////////////////////////////////////////////////
// IteratorBlockEnumerator

var ss_IteratorBlockEnumerator = function IteratorBlockEnumerator$(moveNext, getCurrent, dispose, $this) {
    this._moveNext = moveNext;
    this._getCurrent = getCurrent;
    this._dispose = dispose;
    this._this = $this;
};

ss_IteratorBlockEnumerator.prototype = {
	moveNext: function IteratorBlockEnumerator$moveNext() {
        try {
		    return this._moveNext.call(this._this);
        }
        catch (ex) {
            if (this._dispose)
                this._dispose.call(this._this);
            throw ex;
        }
	},
	get_current: function IteratorBlockEnumerator$get_current() {
		return this._getCurrent.call(this._this);
	},
	reset: function IteratorBlockEnumerator$reset() {
		throw new ss_NotSupportedException('Reset is not supported.');
	},
	dispose: function IteratorBlockEnumerator$dispose() {
		if (this._dispose)
            this._dispose.call(this._this);
	}
};

Type.registerClass(global, 'ss.IteratorBlockEnumerator', ss_IteratorBlockEnumerator, null, [ss_IEnumerator, ss_IDisposable]);

///////////////////////////////////////////////////////////////////////////////
// Task

var ss_Task = function Task$(action, state) {
	this._action = action;
	this._state = state;
	this.exception = null;
	this.status = 0;
	this._thens = [];
	this._result = null;
};

ss_Task.prototype = {
	continueWith: function Task$continueWith(continuation) {
		var tcs = new ss_TaskCompletionSource();
		var _this = this;
		var fn = function() {
			try {
				tcs.setResult(continuation(_this));
			}
			catch (e) {
				tcs.setException(ss_Exception.wrap(e));
			}
		};
		if (this.isCompleted()) {
			setTimeout(fn, 0);
		}
		else {
			this._thens.push(fn);
		}
		return tcs.task;
	},
	start: function Task$start() {
		if (this.status !== 0)
			throw 'Task was already started.';
		var _this = this;
		this.status = 3;
		setTimeout(function() {
			try {
				var result = _this._action(_this._state);
				delete _this._action;
				delete _this._state;
				_this._complete(result);
			}
			catch (e) {
				_this._fail(new ss_AggregateException([ss_Exception.wrap(e)]));
			}
		}, 0);
	},
	_runCallbacks: function Task$_runCallbacks() {
		for (var i = 0; i < this._thens.length; i++)
			this._thens[i](this);
		delete this._thens;
	},
	_complete: function Task$_complete(result) {
		if (this.isCompleted())
			return false;
		this._result = result;
		this.status = 5;
		this._runCallbacks();
		return true;
	},
	_fail: function Task$_fail(exception) {
		if (this.isCompleted())
			return false;
		this.exception = exception;
		this.status = 7;
		this._runCallbacks();
		return true;
	},
	_cancel: function Task$_cancel() {
		if (this.isCompleted())
			return false;
		this.status = 6;
		this._runCallbacks();
		return true;
	},
	isCanceled: function Task$isCanceled() {
		return this.status === 6;
	},
	isCompleted: function Task$isCompleted() {
		return this.status >= 5;
	},
	isFaulted: function Task$isFaulted() {
		return this.status === 7;
	},
	getResult: function Task$getResult() {
		switch (this.status) {
			case 5:
				return this._result;
			case 6:
				throw 'Task was cancelled.';
			case 7:
				throw this.exception;
			default:
				throw 'Task is not yet completed.';
		}
	},
	dispose: function Task$dispose() {
	}
};

ss_Task.delay = function Task$delay(delay) {
	var tcs = new ss_TaskCompletionSource();
	setTimeout(function() {
		tcs.setResult(0);
	}, delay);
	return tcs.task;
};

ss_Task.fromResult = function Task$fromResult(result) {
	var t = new ss_Task();
	t.status = 5;
	t._result = result;
	return t;
};

ss_Task.run = function Task$fromResult(f) {
	var tcs = new ss_TaskCompletionSource();
	setTimeout(function() {
		try {
			tcs.setResult(f());
		}
		catch (e) {
			tcs.setException(ss_Exception.wrap(e));
		}
	}, 0);
	return tcs.task;
};

ss_Task.whenAll = function Task$whenAll(tasks) {
	var tcs = new ss_TaskCompletionSource();
	if (tasks.length === 0) {
		tcs.setResult([]);
	}
	else {
		var result = new Array(tasks.length), remaining = tasks.length, cancelled = false, exceptions = [];
		for (var i = 0; i < tasks.length; i++) {
			(function(i) {
				tasks[i].continueWith(function(t) {
					switch (t.status) {
						case 5:
							result[i] = t.getResult();
							break;
						case 6:
							cancelled = true;
							break;
						case 7:
							exceptions.addRange(t.exception.get_innerExceptions());
							break;
						default:
							throw 'Invalid task status ' + t.status;
					}
					if (--remaining === 0) {
						if (exceptions.length > 0)
							tcs.setException(exceptions);
						else if (cancelled)
							tcs.setCanceled();
						else
							tcs.setResult(result);
					}
				});
			})(i);
		}
	}
	return tcs.task;
};

ss_Task.whenAny = function Task$whenAny(tasks) {
	if (!tasks.length)
		throw 'Must wait for at least one task';

	var tcs = new ss_TaskCompletionSource();
	for (var i = 0; i < tasks.length; i++) {
		tasks[i].continueWith(function(t) {
			switch (t.status) {
				case 5:
					tcs.trySetResult(t);
					break;
				case 6:
					tcs.trySetCanceled();
					break;
				case 7:
					tcs.trySetException(t.exception.get_innerExceptions());
					break;
				default:
					throw 'Invalid task status ' + t.status;
			}
		});
	}
	return tcs.task;
};

ss_Task.fromDoneCallback = function Task$fromDoneCallback(t, i, m) {
	var tcs = new ss_TaskCompletionSource(), args;
    if (typeof(i) === 'number') {
        args = Array.prototype.slice.call(arguments, 3);
        if (i < 0)
            i += args.length + 1;
    }
    else {
        args = Array.prototype.slice.call(arguments, 2);
        m = i;
        i = args.length;
    }

	var cb = function(v) {
		tcs.setResult(v);
	};
	
    args = args.slice(0, i).concat(cb, args.slice(i));

	t[m].apply(t, args);
	return tcs.task;
};

ss_Task.fromPromise = function Task$fromPromise(p, f) {
	var tcs = new ss_TaskCompletionSource();
	if (typeof(f) === 'number')
		f = (function(i) { return function() { return arguments[i >= 0 ? i : (arguments.length + i)]; }; })(f);
    else if (typeof(f) !== 'function')
        f = function() { return Array.prototype.slice.call(arguments, 0); };

	p.then(function() {
		tcs.setResult(typeof(f) === 'function' ? f.apply(null, arguments) : null);
	}, function() {
		tcs.setException(new ss_PromiseException(Array.prototype.slice.call(arguments, 0)));
	});
	return tcs.task;
};

ss_Task.fromNode = function  Task$fromNode(t, f, m) {
	var tcs = new ss_TaskCompletionSource(), args;
    if (typeof(f) === 'function') {
        args = Array.prototype.slice.call(arguments, 3);
    }
    else {
        args = Array.prototype.slice.call(arguments, 2);
        m = f;
		f = function() { return arguments[0]; };
    }

	var cb = function(e) {
		if (e)
			tcs.setException(ss_Exception.wrap(e));
		else
			tcs.setResult(f.apply(null, Array.prototype.slice.call(arguments, 1)));
	};
	
	args.push(cb);

	t[m].apply(t, args);
	return tcs.task;
};

Type.registerClass(global, 'ss.Task', ss_Task, null, ss_IDisposable);

////////////////////////////////////////////////////////////////////////////////
// TaskStatus
var ss_TaskStatus = function() {
};
ss_TaskStatus.prototype = { created: 0, running: 3, ranToCompletion: 5, canceled: 6, faulted: 7 };
Type.registerEnum(global, 'ss.TaskStatus', ss_TaskStatus, false);

///////////////////////////////////////////////////////////////////////////////
// TaskCompletionSource

var ss_TaskCompletionSource = function TaskCompletionSource$() {
	this.task = new ss_Task();
	this.task.status = 3;
};
ss_TaskCompletionSource.prototype = {
	setCanceled: function TaskCompletionSource$setCanceled() {
		if (!this.task._cancel())
			throw 'Task was already completed.';
	},
	setResult: function TaskCompletionSource$setResult(result) {
		if (!this.task._complete(result))
			throw 'Task was already completed.';
	},
	setException: function TaskCompletionSource$setException(exception) {
		if (!this.trySetException(exception))
			throw 'Task was already completed.';
	},
	trySetCanceled: function TaskCompletionSource$trySetCanceled() {
		return this.task._cancel();
	},
	trySetResult: function TaskCompletionSource$setResult(result) {
		return this.task._complete(result);
	},
	trySetException: function TaskCompletionSource$setException(exception) {
		if (!Type.canCast(exception, ss_AggregateException)) {
			if (Type.canCast(exception, ss_Exception))
				exception = [exception];
			exception = new ss_AggregateException(exception);
		}
		return this.task._fail(exception);
	}
};

Type.registerClass(global, 'ss.TaskCompletionSource', ss_TaskCompletionSource);

///////////////////////////////////////////////////////////////////////////////
// CancelEventArgs

var ss_CancelEventArgs = function CancelEventArgs$() {
    ss_CancelEventArgs.call(this);
    this.cancel = false;
}
Type.registerClass(global, 'ss.CancelEventArgs', ss_CancelEventArgs, ss_EventArgs);

///////////////////////////////////////////////////////////////////////////////
// Interfaces

var ss_IApplication = function() { };
Type.registerInterface(global, 'ss.IApplication', ss_IApplication);

var ss_IContainer = function () { };
Type.registerInterface(global, 'ss.IContainer', ss_IContainer);

var ss_IObjectFactory = function () { };
Type.registerInterface(global, 'ss.IObjectFactory', ss_IObjectFactory);

var ss_IEventManager = function () { };
Type.registerInterface(global, 'ss.IEventManager', ss_IEventManager);

var ss_IInitializable = function () { };
Type.registerInterface(global, 'ss.IInitializable', ss_IInitializable);

if (global.ss) {
  for (var n in ss) {
    if (ss.hasOwnProperty(n))
      global.ss[n] = ss[n];
  }
}
else {
  global.ss = ss;
}

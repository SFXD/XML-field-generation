// Most of the code Copyright © 2016 Ezra Kenigsberg
// Modifications, adaptations and some improvements © 2016 Geoffrey Bessereau
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."	
//GetName to use in same edge cases
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getActiveSheet();

// GetFieldXML() is the function that instantiates the XMLMaker() object
function GetFieldXML(strLabel, strFullName, strFieldType, strTable) {
  var strXML = '';
  
  // open field description
  strXML = ConcatTag(strXML, 1, 'fields');
  // API Name
   // adds "Ref" before the "__c" in the case of a Lookup or MasterDetail, and "Is" before the field name in the case of a checkbox to respect EMPAUA conventions
    if(strFieldType == 'MasterDetail'){
      strXML = ConcatTag(strXML, 2, 'fullName', HideZLS(strFullName, toCamel(GetAPINameComp(strLabel)) + 'Ref__c'));} else if(strFieldType == 'Lookup') {
      strXML = ConcatTag(strXML, 2, 'fullName', HideZLS(strFullName, toCamel(GetAPINameComp(strLabel)) + 'Ref__c'));} else if(strFieldType == 'Checkbox'){
      strXML = ConcatTag(strXML, 2, 'fullName', 'Is' + HideZLS(strFullName, toCamel(GetAPINameComp(strLabel)) + '__c'));} else if (strFieldType == 'Boolean') {
      strXML = ConcatTag(strXML, 2, 'fullName', 'Is' + HideZLS(strFullName, toCamel(GetAPINameComp(strLabel)) + '__c'));} else {
      strXML = ConcatTag(strXML, 2, 'fullName', HideZLS(strFullName, toCamel(GetAPINameComp(strLabel)) + '__c'));
    }
  
  // UI Label
  strXML = ConcatTag(strXML, 2, 'label', strLabel);
  
  // if no type specified, default to 'Text'
  if (strFieldType == '') {
    strFieldType = 'Text';
  }
  
  // if no Table specified, default to 'Table'
  strTable = HideZLS(strTable, 'Object');
  
  // set other stuff to defaulty values based on type
  switch (strFieldType) {
    case 'Checkbox':
      strXML = ConcatTag(strXML, 2, 'defaultValue', 'false');
      break;
    case 'Boolean':
      strFieldType = 'Checkbox';
      strXML = ConcatTag(strXML, 2, 'defaultValue', 'false');
      break;
    case 'Currency':
      strXML = ConcatTag(strXML, 2, 'precision', strTable);
      strXML = ConcatTag(strXML, 2, 'scale', 18-strTable);
      break;
    case 'Date':
        // don't do anything
        break;
    case 'Email':
      // don't do anything
      break;
    case 'email':
      strFieldType = 'Email';
      break;
    case 'DateTime':
      // don't do anything
      break;
      case 'Lookup':
        strXML = ConcatTag(strXML, 2, 'referenceTo', GetAPIName(strTable));
        strXML = ConcatTag(strXML, 2, 'relationshipLabel', strTable + ' ' + strLabel);
        strXML = ConcatTag(strXML, 2, 'relationshipName', GetAPINameComp(strTable + ' ' + sheet.getName(), false));
      break; 
      case 'MasterDetail':
        strXML = ConcatTag(strXML, 2, 'externalId', 'false');
        strXML = ConcatTag(strXML, 2, 'referenceTo', GetAPIName(strTable));
        strXML = ConcatTag(strXML, 2, 'relationshipLabel', strTable + ' ' + sheet.getName());
      
      break;  strXML = ConcatTag(strXML, 2, 'relationshipName', GetAPINameComp(strTable + ' ' + sheet.getName(), false));
        strXML = ConcatTag(strXML, 2, 'relationshipOrder', '0');
        strXML = ConcatTag(strXML, 2, 'reparentableMasterDetail', 'false');      
        strXML = ConcatTag(strXML, 2, 'trackTrending', 'false');      
        strXML = ConcatTag(strXML, 2, 'writeRequiresMasterRead', 'false');      
      case 'Number':
        strXML = ConcatTag(strXML, 2, 'precision', strTable);
        strXML = ConcatTag(strXML, 2, 'scale', '0');
      break;
      case 'Decimal':
        strFieldType = 'Number';
        strXML = ConcatTag(strXML, 2, 'precision', strTable);
        strXML = ConcatTag(strXML, 2, 'scale', 18-strTable);
      break;
      case 'Percent':
        strXML = ConcatTag(strXML, 2, 'precision', strTable);
        strXML = ConcatTag(strXML, 2, 'scale', 18-strTable);
      break;
        case 'Phone':
        // don't do anything
        break;
    case 'Picklist':
      var picklistlines = strTable.split('\n');
      strXML = ConcatTag(strXML, 2, 'picklist');
      for(var i = 0;i < picklistlines.length;i++){
      strXML = ConcatTag(strXML, 3, 'picklistValues');
      strXML = ConcatTag(strXML, 4, 'fullName', picklistlines[i]);
      strXML = ConcatTag(strXML, 4, 'default', 'false');
      strXML = ConcatTag(strXML, 3, '/picklistValues');        
      }
      strXML = ConcatTag(strXML, 2, '/picklist');
      break;
        case 'Text':
        strXML = ConcatTag(strXML, 2, 'length', strTable);
      break;
        case 'Text Area':
    strFieldType = 'TextArea';
        break;
        case 'TextArea':
    //do nothing
        break;
    default:
      strXML = '#TYPE';
  }
  
  if(strXML != '#TYPE'){
    // Type
    strXML = ConcatTag(strXML, 2, 'type', strFieldType);
    
    // close fields tag
    strXML = ConcatTag(strXML, 1, '/fields');
  }
  return strXML;
}


// ConcatTag() creates simple XML tag pairs
function ConcatTag(strXML, intTabs, strTag, strValue) {
  var str;
  
  if(!strValue) {
    str = strXML + Tabs(intTabs) + '<' + strTag + '>' + '\r\n';
  } else {
    str =  strXML + Tabs(intTabs) + '<' + strTag + '>' + strValue + '</' + strTag + '>' + '\r\n';
  }
  return str;
}

// GetAPIName() translates Salesforce UI Field Labels into
// Salesforce API Field Names; it's handy for creating documentation
function GetAPIName(strLabel) {
  // ensure the input isn't null, or an API Field Name already
  if(strLabel != '' && Right(strLabel, 3) != '__c'){
    strLabel = MultiReplace(strLabel, /\W/g, '_', /_{2,}/g, '_', /^_*/g, '', /_*$/g, '');
    if(strLabel.search(/^\d/g) > -1){
      strLabel = 'X' + strLabel;
    }

    return Left(removeDiacritics(strLabel), 39) + '__c';

  }
  else {
    return removeDiacritics(strLabel);
  } 
}

// GetAPINameComp() translates Salesforce UI Field Labels into
// Salesforce API Field Name Compatible strings; it does not aapend the __c after the field.
function GetAPINameComp(strLabel) {
  // ensure the input isn't null, or an API Field Name already
  if(strLabel != '' && Right(strLabel, 3) != '__c'){
    strLabel = MultiReplace(strLabel, /\W/g, '', /_{2,}/g, '_', /^_*/g, '', /_*$/g, '');
    if(strLabel.search(/^\d/g) > -1){
      strLabel = 'X' + strLabel;
    }

    return Left(removeDiacritics(strLabel), 39);

  }
  else {
    return removeDiacritics(strLabel);
  } 
}

// MultiReplace() is handed three kinds of arguments:
// arg0 is the original string;
// argX is the sought string; argX+1 is the replacement string.
// X is always an odd number.
function MultiReplace() {
  var strMR = MultiReplace.arguments[0];
  // ensure an odd number of arguments was handed to MultiReplace
  if (MultiReplace.arguments.length % 2 == 1) { 
    for (i = 1; i < MultiReplace.arguments.length; i = i + 2) {
      strMR = strMR.replace(MultiReplace.arguments[i], MultiReplace.arguments[i + 1]);
    }
    return strMR;
  }
  else {
    return '#ARGS!';
  }
}

function AddSuffix(id) { // fluff up a 15 char id to return an 18 char id
  if (id == null || id.length == 0 || id.length == 18) return id;
  id = id.replace(/\"/g, ''); // scrub quotes from this id
  if (id.length != 15) {
    //print('well, id is not 15, bye' + id + ' ' + id.length);
    return '#LEN!';
  }
  var suffix = "";
  for (var i = 0; i < 3; i++) {
    var flags = 0;
    for (var j = 0; j < 5; j++) {
      var c = id.charAt(i * 5 + j);
      if (c >= 'A' && c <= 'Z') {
        flags += 1 << j;
      }
    }
    if (flags <= 25) {
      suffix += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(flags);
    } else {
      suffix += "012345".charAt(flags-26);
    }
  }
  return id + suffix;
}

function StrReverse(strIn){
  splitext = strIn.split("");
  revertext = splitext.reverse();
  reversed = revertext.join("");
  return reversed;
}

function PadDigits(n, totalDigits){ 
  n = n.toString(); 
  var pd = ''; 
  if (totalDigits > n.length) 
  { 
    for (i=0; i < (totalDigits-n.length); i++) 
    { 
      pd += '0'; 
    } 
  } 
  return pd + n.toString(); 
} 

function Dec2Bin(dec) {
  dec = parseInt(dec);
  var bin = dec.toString(2);
  return bin;
}

function RepairCaps(strInID) {
  if(strInID.length != 18){
    return strInID;
  }
  
  var strCaps = StrReverse(PadDigits(Dec2Bin(strInID.toUpperCase().charCodeAt(15) - 65), 5).toString()) +
                StrReverse(PadDigits(Dec2Bin(strInID.toUpperCase().charCodeAt(16) - 65), 5).toString()) +
                StrReverse(PadDigits(Dec2Bin(strInID.toUpperCase().charCodeAt(17) - 65), 5).toString());
  var intChar = 0;
  var intCap = 0;
  var strOut = '';
  for(var i = 0; i < 15; i++){
    intChar = strInID.charCodeAt(i);
    intCap = strCaps.charAt(i);
    if (intChar >= 65 && intChar <= 90 && intCap == 0){  //capitalize
      intChar = intChar + 32;
    }
    if (intChar >= 97 && intChar <= 122 && intCap == 1){ //lowercase
      intChar = intChar - 32;
    }
    strOut = strOut + String.fromCharCode(intChar);
  }
  //return strCaps;
  return strOut + strInID.substr(15).toUpperCase();
}

// Left() returns a string's leftmost n characters 
function Left(str, n){
  if (n <= 0)
    return '';
  else if (n > String(str).length)
    return str;
  else
    return String(str).substring(0,n);
}

// Right() returns a string's rightmost n characters 
function Right(str, n){
  if (n <= 0)
    return '';
  else if (n > String(str).length)
    return str;
  else {
    var iLen = String(str).length;
    return String(str).substring(iLen, iLen - n);
  }
} 

// Tabs() repeats a Tab char n times
function Tabs(intCount) {
  var str = '';
  for (n = 0; n < intCount; n++) {  
       str = str + '\t';
       }
       return str;
       }
       
       
       // HideZLS() takes any number of arguments and returns the
       // first argument that isn't a zero-length string.
       function HideZLS() {
         var val;
         for (n = 0; n < HideZLS.arguments.length; n++) {
              val = HideZLS.arguments[n];
              if(val != '') {
                break;
                  }
                  }
                  return val;
              }

//toCamelCase is used to enforce EMPAUA no underscore policy
function toCamel(str){
	return str.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

//RemoveDiacritics is used for the API name generation.
function removeDiacritics(str) {

  var defaultDiacriticsRemovalMap = [
    {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
    {'base':'AA','letters':/[\uA732]/g},
    {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
    {'base':'AO','letters':/[\uA734]/g},
    {'base':'AU','letters':/[\uA736]/g},
    {'base':'AV','letters':/[\uA738\uA73A]/g},
    {'base':'AY','letters':/[\uA73C]/g},
    {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
    {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
    {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
    {'base':'DZ','letters':/[\u01F1\u01C4]/g},
    {'base':'Dz','letters':/[\u01F2\u01C5]/g},
    {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
    {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
    {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
    {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
    {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
    {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
    {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
    {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
    {'base':'LJ','letters':/[\u01C7]/g},
    {'base':'Lj','letters':/[\u01C8]/g},
    {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
    {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
    {'base':'NJ','letters':/[\u01CA]/g},
    {'base':'Nj','letters':/[\u01CB]/g},
    {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
    {'base':'OI','letters':/[\u01A2]/g},
    {'base':'OO','letters':/[\uA74E]/g},
    {'base':'OU','letters':/[\u0222]/g},
    {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
    {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
    {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
    {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
    {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
    {'base':'TZ','letters':/[\uA728]/g},
    {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
    {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
    {'base':'VY','letters':/[\uA760]/g},
    {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
    {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
    {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
    {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
    {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
    {'base':'aa','letters':/[\uA733]/g},
    {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
    {'base':'ao','letters':/[\uA735]/g},
    {'base':'au','letters':/[\uA737]/g},
    {'base':'av','letters':/[\uA739\uA73B]/g},
    {'base':'ay','letters':/[\uA73D]/g},
    {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
    {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
    {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
    {'base':'dz','letters':/[\u01F3\u01C6]/g},
    {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
    {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
    {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
    {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
    {'base':'hv','letters':/[\u0195]/g},
    {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
    {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
    {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
    {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
    {'base':'lj','letters':/[\u01C9]/g},
    {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
    {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
    {'base':'nj','letters':/[\u01CC]/g},
    {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
    {'base':'oi','letters':/[\u01A3]/g},
    {'base':'ou','letters':/[\u0223]/g},
    {'base':'oo','letters':/[\uA74F]/g},
    {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
    {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
    {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
    {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
    {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
    {'base':'tz','letters':/[\uA729]/g},
    {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
    {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
    {'base':'vy','letters':/[\uA761]/g},
    {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
    {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
    {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
    {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
  ];

  for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
    str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
  }

  return str;

}

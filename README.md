![Version](https://img.shields.io/badge/Version-0.0.9-blue.svg)

# **XML field generation**
Original Developer @Ezra Kenigsberg http://www.ezrakenigsberg.com/ 

### License
"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."	

### A tool to generate XML for Salesforce fields via a GoogleSheet Data Dictionary
Modifications made to Ezra Kenigsberg's version include Master-Detail handling, Picklist handling, API naming, to say a few. This is stilll a work in progress.

### instructions, sorta

it is buggy and shit,like loads of small bugs - if the lighting field creator exists one day i'll use that myself instead of thistool

but in the meantime yeah my stuff works well

- short version is take the gscript
- put it in a google sheet
- then do these columns
- label, forcedapiname (optional, can be null), type, value, description
- label is the label, it will take stuff as-is
- forcedapiname takes stuff as is if specified. you can leave it as null otherwise so it calculates api name
- type is the type of field
- value is variables : if type is text, set the text length
- if thype is number it sets precision
- if type is decimal, it sets decimal number
- if lookup/maserdetail it sets the obejct to point to
- picklist, it sets values (one per line)
- Use the function `GetFieldXML(label,apiname, type, value, description)`
- then all you need to do is copy the xml
- put it in sublimer and emove the stupid double quotes that google adds
- and fix a minor couple of things :
- for lookpus it allways adds `__c` to the object even if it's astandard one, fix that
- for picklists there's a stupid carriage return in the the `<sorted>` node that can throw an error, if it does, just find the line of the picklist for `sorted`, see the carriage return and delete the extra one (it's easily seeable)
- and that's mostly it.
- once you push the fields remember to query the object, all fields, and profiles again via an IDE and to set visibility
- there's a regex for that on our wiki https://sfxd.github.io/article-regex.html

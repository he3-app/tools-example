import { transformTool } from '@he3-kit/utils';
import coffee from 'coffeescript';

const sampleData = `class Animal
constructor: (@name) ->

sayName: ->
  console.log "My name is #{@name}"

class Dog extends Animal
constructor: (@breed, name) ->
  super name

bark: ->
  console.log "Woof!"

dog = new Dog "Labrador", "Buddy"
dog.sayName() 
dog.bark() `;

function CoffeeScriptToJavascript(tsCode: string) {
  return coffee.compile(tsCode);
}

export default transformTool({
  inputLang: 'CoffeeScript',
  outputLang: 'JavaScript',
  sampleData,
  inputHandler: CoffeeScriptToJavascript,
});

export const toolMetaInfo = {
  name: 'CoffeeScript to JavaScript',
  description: 'Convert CoffeeScript to JavaScript',
  keywords: ['coffeescript', 'javascript'],
};

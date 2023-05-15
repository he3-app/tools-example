import {textTransformTool} from '@he3-kit/utils'
import {toByteArray } from 'base64-js';
import { Buffer } from 'buffer';
const sampleData = `ewogICAgImlkIjogMSwKICAgICJ1dWlkIjogIjNkODc3NDk0LWU3ZDQtNDhlMy1hYTdhLTE2NDM3M2E3OTIwZCIsCiAgICAibmFtZSI6ICJIZTMiLAogICAgImFnZSI6IDI2LAogICAgImlzQWN0aXZlIjogdHJ1ZSwKICAgICJyZWdpc3RlcmVkIjogIjIwMjAtMDItMDNUMDY6MDA6MDMgLTA4OjAwIiwKICAgICJ0YWdzIjogWwogICAgICAidG9vbHMiLAogICAgICAiZGV2ZWxvcG1lbnQiCiAgICBdLAogICAgImxhbmd1YWdlIjogWwogICAgICB7CiAgICAgICAgImlkIjogMCwKICAgICAgICAibmFtZSI6ICJFbmdsaXNoIgogICAgICB9LAogICAgICB7CiAgICAgICAgImlkIjogMSwKICAgICAgICAibmFtZSI6ICJFc3Bhw7FvbCIKICAgICAgfSwKICAgICAgewogICAgICAgICJpZCI6IDIsCiAgICAgICAgIm5hbWUiOiAiQ2hpbmVzZSIKICAgICAgfQogICAgXQogIH0=`
export default textTransformTool({
    inputHandler: decode,
    sampleData: sampleData,
    autoFillInputCondition: isBase64,
  });
  
  function decode(str: string): string {
    const bytes = toByteArray(str);
    return Buffer.from(bytes).toString();
  }
  
 
  
  export function isBase64(text: string) {
    const reg =
      /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}={2})$/;
    return reg.test(text);
  }
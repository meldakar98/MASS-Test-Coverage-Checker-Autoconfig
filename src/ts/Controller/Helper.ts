import { time } from "console";

export function readFile(file:File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          resolve(content);
        };
        reader.onerror = (event) => {
          reject(new Error("Error reading file"));
        };
        reader.readAsText(file);
      } catch (error) {
        reject(error);
      }
    });
  }


export function getPositionString(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

export function getParsedDate(): string{
  const parseTime = function(timeElement: number): string{
    return timeElement < 10 ? "0"+timeElement : ""+timeElement;
  }
  let currentdate = new Date(); 
  let datetime =  parseTime(currentdate.getDate()) + "."
                  + parseTime(currentdate.getMonth()+1)  + "." 
                  + parseTime(currentdate.getFullYear()) + " "  
                  + parseTime(currentdate.getHours()) + ":"  
                  + parseTime(currentdate.getMinutes()) + ":" 
                  + parseTime(currentdate.getSeconds());
  return datetime;
}


export function calculateTxtFileWeight(text: string, round): number {
  // Calculate the weight of the string in bytes
  //const bytes = Buffer.byteLength(text, 'utf8');
  
  // Assuming each character in the string is encoded using UTF-8
  const bytesPerCharacter = 1;
  
  // Calculate the total number of bytes
  const totalBytes = text.length * bytesPerCharacter;
      
  // Convert bytes to kilobytes
  const totalKilobytes = totalBytes / 1024;
    
  return Math.round(totalKilobytes * (10**round)) / 100;
}
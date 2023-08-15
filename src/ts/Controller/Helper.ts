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
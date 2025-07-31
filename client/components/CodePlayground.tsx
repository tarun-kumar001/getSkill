import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  Play, 
  Square, 
  Download, 
  Share, 
  Code, 
  Terminal,
  FileText,
  Settings,
  Maximize2
} from "lucide-react";

export function CodePlayground() {
  const [code, setCode] = useState(`// React Hook Example
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isEven, setIsEven] = useState(true);

  useEffect(() => {
    setIsEven(count % 2 === 0);
  }, [count]);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <p>The count is {isEven ? 'even' : 'odd'}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}

export default Counter;`);

  const [output, setOutput] = useState(`> Running React Component...

✓ Component rendered successfully
✓ useState hook initialized with value: 0
✓ useEffect hook registered for count changes
✓ Event handlers attached

Console Output:
Component mounted
Count updated: 0 (even)

Ready for interaction!`);

  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput("Running code...");
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(`> Code executed successfully!

✓ Syntax check passed
✓ Type checking completed
✓ Component rendered

Console Output:
Component mounted
Count: 0 (even)
Ready for user interaction

Execution time: 1.2s
Memory usage: 4.2MB`);
      setIsRunning(false);
    }, 1500);
  };

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' }
  ];

  return (
    <Card className="w-full h-full bg-gray-800 border-gray-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code Playground
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              <Maximize2 className="w-3 h-3 mr-1" />
              Fullscreen
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Language Selector */}
        <div className="flex gap-1 mb-2">
          {languages.map((lang) => (
            <Badge 
              key={lang.id} 
              variant={lang.id === 'javascript' ? 'default' : 'outline'}
              className="text-xs cursor-pointer"
            >
              {lang.icon} {lang.name}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger value="editor" className="text-xs">Editor</TabsTrigger>
            <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-2">
            <div className="bg-gray-900 border border-gray-600 rounded h-48 overflow-hidden">
              <div className="bg-gray-800 px-3 py-1 border-b border-gray-600 flex items-center justify-between">
                <span className="text-xs text-gray-400">main.jsx</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-gray-100 p-3 text-xs font-mono resize-none border-none outline-none"
                style={{ 
                  fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
                  lineHeight: '1.4'
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="output" className="mt-2">
            <div className="bg-gray-900 border border-gray-600 rounded h-48 overflow-auto">
              <div className="bg-gray-800 px-3 py-1 border-b border-gray-600 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">Console</span>
              </div>
              <pre className="text-xs text-gray-100 p-3 font-mono whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-2">
            <div className="bg-white border border-gray-600 rounded h-48 overflow-hidden">
              <div className="bg-gray-100 px-3 py-1 border-b border-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600 ml-2">localhost:3000</span>
              </div>
              <div className="p-4 text-black">
                <div className="border border-gray-300 rounded p-4 bg-white">
                  <h2 className="text-lg font-semibold mb-2">Count: 0</h2>
                  <p className="text-gray-600 mb-3">The count is even</p>
                  <div className="space-x-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      Increment
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      Decrement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Control Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={runCode}
            disabled={isRunning}
            size="sm" 
            className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700"
          >
            {isRunning ? (
              <>
                <Square className="w-3 h-3 mr-1" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Run Code
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Share className="w-3 h-3 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>

        {/* Live Collaboration Indicator */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>3 people editing</span>
          </div>
          <span>Auto-save enabled</span>
        </div>
      </CardContent>
    </Card>
  );
}

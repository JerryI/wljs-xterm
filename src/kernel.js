import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

let terminal = {};

core.UIXtermPrint = async (args, env) => {
    if (!terminal.loaded) return;
    console.log(args);
    const data = interpretate(args[0], env);
    const type = interpretate(args[1], env);
    if (type.toLowerCase() == 'error')
        terminal.write(`\r\n\u001b[1m\u001b[38;5;202mWL \x1B[1;3;31mERROR\u001b[0m ${data.trim()}`);
    else 
        terminal.write(`\r\n\u001b[1m\u001b[38;5;202mWL \x1B[38;5;32m${type}\u001b[0m ${data.trim()}`);
}

core.UIXtermLoad = async (args, env) => {
  setTimeout(async () => {
      terminal = new Terminal({
        'theme': {  
          background: 'rgba(255, 255, 255, 0)', 
          foreground: '#000000', 
          cursor: "rgba(0, 128, 128, 0.3)", 
          selectionBackground: "rgba(128, 128, 128, 0.3)"
        },
        fontFamily: "Fixedsys Excelsior",
        fontSize: 14
    });

    
    // Load FitAddon on terminal, this is all that's needed to get web links
    // working in the terminal.
    const fit = new FitAddon();
    terminal.loadAddon(fit);

    terminal.loaded = true;
    const uid = await interpretate(args[0], env);

    terminal.open(document.getElementById(uid));


    fit.fit();
    terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ \r\n');

    const origConsoleError = console.error;
    console.error = (...args) => {
      origConsoleError.apply(console, args);
      let array = [...args];
      array = array.map((el) => {
        //if (typeof el == 'object') return JSON.stringify(el);
        return el;
      });
      terminal.write('\r\n\u001b[1m\u001b[38;2;253;182;0mJS \x1B[1;3;31mERROR\u001b[0m ' + array.join('\r\n'));
    };
    
    const origConsoleLog = console.log;
    console.log = (...args) => {
      origConsoleLog.apply(console, args);
      let array = [...args];
      array = array.map((el) => {
        //if (typeof el == 'object') return JSON.stringify(el);
        return el;
      });
      terminal.write('\r\n\u001b[1m\u001b[38;2;253;182;0mJS \u001b[0m ' + array.join('\r\n'));
    };

  }, 300);
  
}

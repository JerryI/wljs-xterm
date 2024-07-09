import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from '@xterm/addon-search';

import LocalEchoController from 'local-echo';

let terminal = {};
const localEcho = new LocalEchoController();

core.UIXtermPrint = async (args, env) => {
    if (!terminal.loaded) return;
    const data = interpretate(args[0], env);
    //const type = interpretate(args[1], env);
    terminal.write(data.trim());
}


function randomChoice(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

let globalCallback = undefined;

core.UIXtermResolve = (args, env) => {
  if (!terminal.loaded) return;
  const data = interpretate(args[0], env);
  console.log(data);
  //const type = interpretate(args[1], env);
  if (!globalCallback ) {
    localEcho.println(decodeURIComponent(data).trim());
  } else {
    globalCallback(decodeURIComponent(data).trim());
  }
}

core.UIXtermLoad = async (args, env) => {
  setTimeout(async () => {
      terminal = new Terminal({

        cursorBlink: "block",
        theme: {  
          background: 'transparent', 
          foreground: '#000000', 
          selectionBackground: "transparent",
          selectionForeground: "yellow",
          cursor: "rgba(0, 128, 128, 0.3)", 
          selection: "blue"
        },
        fontSize: 14,
    });

    terminal.options.theme.background = "rgb(0,0,0,0)";
    terminal.options.theme.selection = "rgba(128, 128, 255, 0.3)";
    terminal.options.theme.selectionInactiveBackground = "rgba(128, 128, 255, 0.3)";
    terminal.options.theme.selectionBackground = "rgba(128, 128, 255, 0.3)";

    const searchAddon = new SearchAddon();
    terminal.loadAddon(searchAddon);
    // Load FitAddon on terminal, this is all that's needed to get web links
    // working in the terminal.
    const fit = new FitAddon();
    terminal.loadAddon(fit);

    terminal.loaded = true;
    const uid = await interpretate(args[0], env);

    const channel = await interpretate(args[1], env);

    terminal.open(document.getElementById(uid));
    document.getElementsByClassName('xterm-viewport')[0].style.backgroundColor = "transparent";


    fit.fit();


    // Receive data from socket
   /* ws.onmessage = msg => {
      terminal.write("\r\n" + JSON.parse(msg.data).data);
      curr_line = "";
    };*/

  
    terminal.writeln('This is a virtual terminal connected to Wolfram Kernel');
    terminal.writeln('Your input is directly sent to the evaluation loop');
    terminal.writeln('');

  
    
    terminal.loadAddon(localEcho);



    const spinners = ['|/-\\', '⣾⣽⣻⢿⡿⣟⣯⣷'];

// Read a single line from the user
    const read = (cbk) => localEcho.read("$ ")
    .then(input => cbk(input))
    .catch(error => alert(`Error reading: ${error}`));

    const loop = (cmd) => {
      
      const spinner = randomChoice(spinners);
      localEcho.print(spinner.charAt(0));
      let frame = 0;
      const interval = setInterval(() => {
        frame += 1;
        if (frame >= spinner.length) frame = 0;
        localEcho.print('\b'+spinner.charAt(frame));
      }, 50);

      globalCallback = (answer) => {
        clearInterval(interval);
        localEcho.print('\b'); 
        localEcho.print('> ');
        localEcho.print(answer.replaceAll('\\x1b', '\x1b'));
        localEcho.println('');localEcho.println('');
        globalCallback = () => {}
        read(loop)
      }

      server.emitt(channel, '"'+encodeURIComponent(cmd)+'"', "Write");

    }

    read(loop);
    // paste value
    /*terminal.on("paste", function(data) {
      curr_line += data;
      term.write(data);
    });*/
    

  }, 100);
  
}

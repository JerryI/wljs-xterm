BeginPackage["Notebook`XTerm`", {
    "JerryI`Misc`Events`",
    "JerryI`Misc`Events`Promise`",
    "JerryI`Notebook`", 
    "JerryI`Notebook`Evaluator`", 
    "JerryI`Notebook`Kernel`", 
    "JerryI`Notebook`Transactions`",
    "JerryI`WLX`",
    "JerryI`WLX`Importer`",
    "JerryI`WLX`WebUI`", 
    "JerryI`Notebook`AppExtensions`",
    "KirillBelov`HTTPHandler`",
    "KirillBelov`HTTPHandler`Extensions`",
    "KirillBelov`Internal`",
    "Notebook`Editor`Snippets`",
    "JerryI`WLX`WLJS`",
    "JerryI`Misc`WLJS`Transport`"    
}]

UIXtermLoad;
UIXtermPrint;
UIXtermResolve;
UIXtermColorize;

Begin["`Private`"]

UIXtermColorize[str_String] := StringReplace[str, {
    x: RegularExpression["\"[^\"]+\""] :> StringJoin["\\x1b[38;5;137m", x, "\\x1b[0m"],
    d: RegularExpression["\\-?\\d*\\.?\\d*"] :> StringJoin["\\x1b[38;5;96m", d, "\\x1b[0m"],
    b: RegularExpression["[\\{\\}]+"] :> StringJoin["\\x1b[38;5;22m", b, "\\x1b[0m"],
    g: RegularExpression["[\\<\\|]+"] :> StringJoin["\\x1b[38;5;23m", g, "\\x1b[0m"],
    g: RegularExpression["[\\|\\>]+"] :> StringJoin["\\x1b[38;5;23m", g, "\\x1b[0m"]
  }]

rootDir = $InputFileName // DirectoryName // ParentDirectory;
xTerm = ImportComponent[FileNameJoin[{rootDir, "template", "XTerm.wlx"}] ];

With[{http = AppExtensions`HTTPHandler},
    http["MessageHandler", "XtermWindow"] = AssocMatchQ[<|"Path" -> "/xterm"|>] -> xTerm;
];


SnippetsCreateItem[
    "xtermCall", 

    "Template"->ImportComponent[FileNameJoin[{rootDir, "template", "Ico.wlx"}] ], 
    "Title"->"Terminal"
];

(* just fwd *)
EventHandler[SnippetsEvents, {
    "xtermCall" -> Function[assoc, WebUILocation["/xterm", assoc["Client"], "Target"->_, "Features"->"width=660, height=440, top=0, left=800"] ]
}];

End[]
EndPackage[]
BeginPackage["Notebook`XTerm`", {
    "JerryI`Misc`Events`",
    "JerryI`Misc`Events`Promise`",
    "JerryI`Notebook`", 
    "JerryI`WLX`",
    "JerryI`WLX`Importer`",
    "JerryI`WLX`WebUI`", 
    "JerryI`Notebook`AppExtensions`"
}]

Begin["`Private`"]

rootDir = $InputFileName // DirectoryName // ParentDirectory;
AppExtensions`TemplateInjection["AppFooter"] = ImportComponent[FileNameJoin[{rootDir, "template", "xterm.wlx"}] ];


End[]
EndPackage[]
var vm = {};

// Load viewmodel
initPackageLoader = function(viewModel){
    vm = viewModel;
}

 parseExistingPackage = function(){
            
            
            try{
                vm.author(vm.existingPackage.author)
                vm.comment(vm.existingPackage.comment);
                vm.description(vm.existingPackage.description);
                vm.versionNumber(vm.existingPackage.versionNumber);
                vm.name(vm.existingPackage.name);
                vm.status(vm.existingPackage.status);
            }
            catch(e){alert("Error parsing package: " + e);}
            loadExistingTables();
            loadExistingVba();
            loadExistingSQL();
            loadExistingLocalizations();
            
        }

loadExistingTables = function(){
    try{
        var existingPackageTables = vm.existingPackage.install.tables;
        // There might not be any tables or fields in the package.
        if (!existingPackageTables){
            return;
        }
        //find all mutual tables
        ko.utils.arrayForEach(existingPackageTables, function(et){
            
           ko.utils.arrayForEach(vm.tables(), function(table){
               if(table.guiFields()){
                   ko.utils.arrayForEach(table.guiFields(),function(field){
                   //Flag fields and tables as existing in package
                   ko.utils.arrayForEach(et.fields,function(ef){
                       if(ef.name == field.name && et.name == table.name){
                           field.inExistingPackage(true);
                           field.selected(true);
                           table.inExistingPackage(true);
                       }
                   });
               });
               }
            //set selected or partially selected tables
            table.indeterminate(table.getIndeterminate());
           });
           
        });
    }
    catch(e){alert("Error loading tables from package: " + e);}
}
        
loadExistingVba = function(){
    var existingPackageVba = vm.existingPackage.install.vba;
    if(!existingPackageVba){
        return;
    }
    try{
        //Fetch vba from package
        ko.utils.arrayForEach(existingPackageVba,function(eVba){
            //Fetch vba named the same as in the existing package as in the current database, select it and mark as inExistingPackage
            ko.utils.arrayForEach(ko.utils.arrayFilter(vm.vbaComponents(),function (v){
                return v.name == eVba.name;
            }), function(vbaComponent){
                vbaComponent.inExistingPackage(true);
                vbaComponent.selected(true);
            });
        });
    }
    catch(e){alert(e);}
}

loadExistingSQL = function(){
    var existingPackageSQL = vm.existingPackage.install.sql;
    if(!existingPackageSQL){
        return;
    }
    try{
        //Fetch sql from package
        ko.utils.arrayForEach(existingPackageSQL, function(eSql){
            //Fetch sql named the same as in the existing package as in the current database, select it and mark as inExistingPackage
            ko.utils.arrayForEach(ko.utils.arrayFilter(vm.sql(),function (s){
                return s.name == eSql.name;
            }), function(sql){
                sql.inExistingPackage(true);
                sql.selected(true);
            });
        });
    }
    catch(e){alert(e);}
}

loadExistingLocalizations = function(){
    var existingPackageLocalizations = vm.existingPackage.install.localize;
    
    if(!existingPackageLocalizations){
        
        return;
    }
    try{
        //Fetch localizations from package
        ko.utils.arrayForEach(existingPackageLocalizations, function(eLocalizations){
            //Fetch localizations named the same as in the existing package as in the current database, select it and mark as inExistingPackage
            
            ko.utils.arrayForEach(vm.localizations(),function (l){
                
                if(l.owner  == eLocalizations.owner && l.code == eLocalizations.code){
                    l.checked(true);
                    l.inExistingPackage(true);
                }
            });
        });
    }
    catch(e){alert(e);}
}
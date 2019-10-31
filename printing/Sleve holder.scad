difference(){

    difference(){
        translate([0,0,-47]){
            //Outer cylinder
            cylinder($fn = 50, h=74, r1=37, r2=37, center=false);
        }
        translate([0,0,-11]){
            //Coffee cup - cut out
            cylinder($fn = 50, h=125, r1=28, r2=40.5, center=false);
        }
        translate([0,20,-27]){
            //Hollow end
            cube([25,15,10],true);
        }
    }

    translate([25,-11.5,-22]){
        //Battery slot
        cube([200,40,18],true);
    }
    
    translate([0,0,-40]){
        //Microbit slot
        cube([200,63,8],true);
    }
    difference(){
        translate([0,20,-49]){
            //Microbit button slot right
            cube([10,10,12],true);
        }
    }
    
    difference(){
        translate([0,-20,-49]){
            //Microbit button slot left
            cube([10,10,12],true);
        }
    }
    
    difference(){
        translate([25,-11.5,-33]){
            //Microbit button slot reset + power
            cube([30,40,10],true);
        }
    }
}

//GPIO 0
translate([-20,-21,-44]){
    cylinder($fn = 50, h=3, r1=1.5, r2=1.5, center=false);
}

//GPIO 1
translate([-20,-11,-44]){
    cylinder($fn = 50, h=3, r1=1.5, r2=1.5, center=false);
}

//GPIO 2
translate([-20,0,-44]){
    cylinder($fn = 50, h=3, r1=1.5, r2=1.5, center=false);
}

//3V
translate([-20,11,-44]){
    cylinder($fn = 50, h=3, r1=1.5, r2=1.5, center=false);
}

//GND
translate([-20,21,-44]){
    cylinder($fn = 50, h=3, r1=1.5, r2=1.5, center=false);
}
// This is a state variable. This will get changed based
// on the current "year" setting.
let barstats = {
    elec: {
        name: "ELEC",
        maximum: 140,
        current: 50,
        iconpath: "elecicon",
        efficiency: 30,
    },
    heat: {
        name: "HEAT",
        maximum: 79,
        current: 50,
        iconpath: "heaticon",
        efficiency: 30,
    },
    energy: {
        name: "ENERGY",
        maximum: 100,
        current: 50,
        iconpath: "energyicon",
        efficiency: 30,
    },
    fuel: {
        name: "FUEL",
        maximum: 76,
        current: 50,
        iconpath: "fuelicon",
        efficiency: 30,
    },
    oil: {
        name: "OIL",
        maximumvalue: 41,
        maximumsize: 150,
        currentcap: 41,
        current: 39,
        clipiconpath: "oilmask",
        spriteiconpath: "oilicon",
    },
    budget: {
        name: "BUDGET",
        maximumvalue: 3200,
        maximumsize: 150,
        currentcap: 3200,
        current: 1500,
        clipiconpath: "budgetmask",
        spriteiconpath: "budgeticon",
    },
    ghgcloud: {
        name: "",
        maximumvalue: 6300,
        maximumsize: 120,
        currentcap: 6300,
        current: 4000,
        clipiconpath: "cloudmask",
        spriteiconpath: "cloudicon",
    },
    building: {
        name: "GHG",
        satisfied: false,
        unsatisfiediconpath: "buildingiconunsat",
        satisfiediconpath: "buildingiconsat",
    }
}

const SATCOLOR = "#91C84B";
const UNSATCOLOR = "#FF0000";

paper.install(window);
window.onload = function() {
    const canvas = document.getElementById("graphCanvas");
    canvas.width = 670;
    canvas.height = 520;

    paper.setup("graphCanvas");

    let staticassets = [];
    let dynamicassets = [];

    let elecbargroup = makeBar(new Point(20,497), barstats.elec);
    let heatbargroup = makeBar(new Point(100,497), barstats.heat);
    let energybargroup = makeBar(new Point(180, 497), barstats.energy);
    let fuelbargroup = makeBar(new Point(110,180), barstats.fuel);

    updateBarToValue(barstats.elec, elecbargroup, 126);
    updateBarToValue(barstats.heat, heatbargroup, 40);
    updateBarToValue(barstats.energy, energybargroup, 101);
    updateBarToValue(barstats.fuel, fuelbargroup, 20);

    let oildrumgroup = makeSpriteGraph(new Point(385 ,422), barstats.oil);
    let budgetgroup = makeSpriteGraph(new Point(487, 132), barstats.budget);
    let ghgcloudgroup = makeSpriteGraph(new Point(590,359), barstats.ghgcloud);
    
    updateSpriteGraph(barstats.oil, oildrumgroup, 39);
    updateSpriteGraph(barstats.budget, budgetgroup, 3200);
    updateSpriteGraph(barstats.ghgcloud, ghgcloudgroup, 1980);

    let GHGgroup = makeGHGBase(new Point(575, 460), barstats.building);

    updateGHGBase(barstats.building, GHGgroup, true);
    
    //max necessary for any one bar is 140
    //height is always the same. 70 on any bar is always at the same y level


    function makeBar(position, barstat){

        const scale = (barstat.maximum / 140);
        // Don't have original code handy and little time remaining, approximation of original scale
        // It is doubtless significantly less complex than this but I simply do not have the time to refine
        const scalefactor = ((1.2 * Math.pow(.3 * scale + .2,2))/(Math.pow(.3*scale + .2, 2) + 1)) + .77;
        const basewidth = 40 * scalefactor;
        const basedepthx = 10 * scalefactor
        const basedepthy = 10 * scalefactor;
        const barheight = 275 * scale;

        let barGroup = new Group();
        
        project.currentStyle = {
            strokeColor: '#000000',
            strokeWidth: 2,
        };

        let baseloop = new Path({
            segments: [
                position,
                position.add([basewidth,0]),
                position.subtract([-basewidth - basedepthx, basedepthy]),
                position.subtract(-basedepthx, basedepthy)
            ],
            closed: true,
            strokeColor: "black",
            name: `${barstat.name}staticbaseloop`,
        });

        let toploop = baseloop.clone();
        toploop.name = `${barstat.name}statictoploop`;
        toploop.position = baseloop.position.subtract([0,barheight]);

        let icon = new Raster(barstat.iconpath);
        icon.position = [baseloop.position.x, 
            baseloop.position.y-(barheight / 2)];
        icon.name = `${barstat.name}staticicon`;

        let firstlinker = new Path.Line({
            from: baseloop.segments[0].point,
            to: toploop.segments[0].point,
            strokeColor: "black",
            name: `${barstat.name}staticlinker1`,
        });

        let secondlinker = new Path.Line({
            from: baseloop.segments[1].point,
            to: toploop.segments[1].point,
            strokeColor: "black",
            name: `${barstat.name}staticlinker2`,
        });

        let thirdlinker = new Path.Line({
            from: baseloop.segments[2].point,
            to: toploop.segments[2].point,
            strokeColor: "black",
            name: `${barstat.name}staticlinker3`,
        });

        let fourthlinker = new Path.Line({
            from: baseloop.segments[3].point,
            to: toploop.segments[3].point,
            strokeColor: "black",
            name: `${barstat.name}staticlinker4`,
        });

        project.currentStyle = {
            strokeWidth: 0,
            strokeColor: 'black'
        };

        let bartitle = new PointText({
            point: baseloop.position.add([0,20]),
            content: barstat.name,
            fontWeight: 'bold',
            justification: 'center',
            name: `${barstat.name}statictitle`,
        });

        barGroup.addChildren([baseloop, toploop, icon, firstlinker, secondlinker, thirdlinker,
            fourthlinker, bartitle]);
        
        staticassets.push(baseloop, toploop, icon, firstlinker, secondlinker, thirdlinker,
            fourthlinker, bartitle);
        
        project.currentStyle = {
            strokeWidth: 1,
        };
        
        return barGroup;

    }

    function updateBarToValue(barstat, bargroup, value){
        barstat.current = value;
        const satisfaction = barstat.current + barstat.efficiency >= barstat.maximum;

        let baseloop = bargroup.getItem({
            name: /.*baseloop/
        });
        let toploop = bargroup.getItem({
            name: /.*toploop/
        });

        let surfaceloop = baseloop.clone();
        surfaceloop.name = "dynamicsurfaceloop";

        let surfacecolor = (satisfaction ? SATCOLOR : UNSATCOLOR);
        surfaceloop.fillColor = surfacecolor;

        surfaceloop.position = surfaceloop.position.subtract([0, 275 * (barstat.current/140)]);
        
        project.currentStyle = {
            strokeWidth: 2,
        };

        let frontloop = new Path({
            segments: [
                baseloop.segments[0].point,
                surfaceloop.segments[0].point,
                surfaceloop.segments[1].point,
                baseloop.segments[1].point,
            ],
            closed: true,
            fillColor: surfacecolor,
            name: `dynamicfrontloop`,
        });

        let sideloop = new Path({
            segments: [
                baseloop.segments[1].point,
                surfaceloop.segments[1].point,
                surfaceloop.segments[2].point,
                baseloop.segments[2].point,
            ],
            closed: true,
            fillColor: surfacecolor,
            name: `dynamicsideloop`,
        });

        let coverpath = new Path({
            segments: [
                toploop.segments[0].point,
                toploop.segments[1].point,
                toploop.segments[2].point,
            ]
        });

        project.currentStyle = {
            strokeWidth: 1,
        };

        let labelyval = ((surfaceloop.position.y > toploop.position.y) ? 
            toploop.position.y - 10 : surfaceloop.position.y - 10)

        let valuelabel = new PointText({
            point: [surfaceloop.position.x + 4, labelyval],
            content: `${barstat.current}`,
            justification: 'center',
            fontSize: 16,
            name: `dynamicvaluelabel`,
        });

        bargroup.addChildren([frontloop, sideloop, valuelabel, coverpath]);
        dynamicassets.push(surfaceloop, frontloop, sideloop, valuelabel, coverpath);
        
        let overeff = null;
        let overcap = null;

        if(barstat.efficiency > 0){
            let effscale = (barstat.efficiency/140) * 275;
            let efffrontloop = new Path({
               segments: [
                toploop.segments[0].point.add([0,effscale]),
                toploop.segments[0].point,
                toploop.segments[1].point,
                toploop.segments[1].point.add([0,effscale])
               ],
               strokeWidth: 2,
               fillColor: surfacecolor,
               closed: true,
               name: "efffrontloop"
            });
            let effsideloop = new Path({
                segments: [
                    toploop.segments[1].point.add([0,effscale]),
                    toploop.segments[1].point,
                    toploop.segments[2].point,
                    toploop.segments[2].point.add([0,effscale])
                ],
                strokeWidth: 2,
                closed: true,
                fillColor: surfacecolor,
                name: "effsideloop"
            });

            let effbotloop = new Path({
                segments: [
                    toploop.segments[0].point.add([0,effscale]),
                    toploop.segments[1].point.add([0,effscale]),
                    toploop.segments[2].point.add([0,effscale]),
                    toploop.segments[3].point.add([0,effscale])
                ],
                strokeWidth: 0,
                closed: true,
            })

            let efftoploop = toploop.clone();
            efftoploop.fillColor = surfacecolor;
            efftoploop.name = "efftoploop";

            bargroup.addChildren([efffrontloop, effsideloop, efftoploop, effbotloop]);
            dynamicassets.push(efffrontloop, effsideloop, efftoploop, effbotloop);

            overeff = (barstat.current > (barstat.maximum - barstat.efficiency));
            overcap = (barstat.current > barstat.maximum);

            if(satisfaction){
                if(overeff){
                    let pastefffrontloop;
                    let pasteffsideloop;
                    let targetloop;
                    if(!overcap){
                        targetloop = surfaceloop  
                    } else if (overcap){
                        targetloop = toploop
                    }
                    pastefffrontloop = new Path({
                        segments: [
                            effbotloop.segments[0].point,
                            effbotloop.segments[1].point,
                            targetloop.segments[1].point,
                            targetloop.segments[0].point,
                        ],
                        fillColor: "#FFA500",
                        closed: true,
                        strokeWidth: 2,
                        name: "pastefffrontloop"
                    });
                    pasteffsideloop = new Path({
                        segments: [
                            effbotloop.segments[1].point,
                            effbotloop.segments[2].point,
                            targetloop.segments[2].point,
                            targetloop.segments[1].point,
                        ],
                        fillColor: "#FFA500",
                        closed: true,
                        strokeWidth: 2,
                        name: "pasteffsideloop"
                    });
                    surfaceloop.sendToBack();
                    if(surfaceloop.position.y - toploop.position.y <= .1){
                        efftoploop.fillColor = "#FFA500"
                    }
                    bargroup.addChildren([pastefffrontloop, pasteffsideloop]);
                    dynamicassets.push(pastefffrontloop, pasteffsideloop)
                }
            }
        }  

        surfaceloop.bringToFront();
        if (barstat.efficiency > 0){
            bargroup.getItem({name: /.*efffrontloop/}).bringToFront();
            bargroup.getItem({name: /.*effsideloop/}).bringToFront();
            if(overeff){
                bargroup.getItem({name: /.*pastefffrontloop/}).bringToFront();
                bargroup.getItem({name: /.*pasteffsideloop/}).bringToFront();
            }
        }
        coverpath.bringToFront();
        bargroup.getItem({name: /.*linker2/}).bringToFront()
        icon = bargroup.getItem({name: /.*ico/});
        icon.bringToFront();
        if(overcap){
            bargroup.getItem({name: /.*efftoploop/}).sendToBack()
        }
        if (overeff && !overcap){
            surfaceloop.sendToBack();
        }

    }

    function cleanupDynamic(){
        for(element of dynamicassets){
            element.remove();
        }
    }

    function makeSpriteGraph(position, barstat){

        //oil size is 150

        let spriteGroup = new Group();

        //Not actually scaling yet
        const scalepercent = (barstat.currentcap / barstat.maximumvalue)
        const scalefactor = ((1.2 * Math.pow(.3 * scalepercent + .2,2))/(Math.pow(.3*scalepercent + .2, 2) + 1)) + .77;
        const spriteheight = barstat.maximumsize * scalepercent;

        let icon = new Raster(barstat.clipiconpath);
        icon.position = position;
        icon.pivot = icon.globalToLocal(icon.bounds.bottomCenter);
        icon.name = `${barstat.name}staticicon`;

        let itemlabel = new PointText({
            point: icon.position.add([0,20]),
            content: barstat.name,
            fontSize: "12",
            justification: 'center',
            name: `${barstat.name}statictitle`,
        });

        let valuelabel = new PointText({
            point: icon.bounds.topCenter.subtract([0,5]),
            content: `${barstat.current}`,
            justification: 'center',
            fontSize: 18,
            name: `${barstat.name}staticvaluelabel`,
        })

        let group = new Group({name: `${barstat.name}clipgroup`});
        
        const rectangle = new Path.Rectangle({
            from: [icon.bounds.topLeft.x - 25 ,icon.bounds.topLeft.y + (150 - (150 * (barstat.current/barstat.currentcap)))],
            to: [icon.bounds.bottomRight.x + 25,icon.bounds.bottomRight.y+25],
            fillColor: 'orange',
            strokeColor: new Color(0,0,0,0),
            name: "valuemask"
        });
        group.addChildren([rectangle,icon]);
        icon.blendMode = "destination-in"
        group.blendMode = "source-over"
        
        let icon2 = new Raster(barstat.spriteiconpath);
        icon2.position = position;
        icon2.name = `${barstat.name}outline`;
        spriteGroup.addChildren([itemlabel, group, icon2, valuelabel]);


        return spriteGroup;
    }

    function updateSpriteGraph(barstat, spritegroup, value){
        barstat.current = value;

        let targetcolor;
        targetcolor = (barstat.current < barstat.currentcap) ? SATCOLOR : UNSATCOLOR;
        let clipgroup = spritegroup.getItem({
            name: /.*clipgroup/,
        });
        let valuelabel = spritegroup.getItem({
            name: /.*valuelabel/
        });
        let mask = clipgroup.firstChild;
        let icon = clipgroup.lastChild;
        let newmask;
        if(barstat.name == "BUDGET"){
            if(barstat.current >= barstat.currentcap){
                let targetraster = "budgeticonwin"
                if(barstat.current > barstat.currentcap){
                    console.log(`Cap above. Cap ${barstat.currentcap}, curr ${barstat.current}`)
                    targetraster = "budgeticonfail"
                }
                let oldicon = spritegroup.getItem({name:/.*staticicon/});
                let newraster = new Raster(targetraster);
                newraster.pivot = newraster.globalToLocal(newraster.bounds.bottomCenter);
                newraster.position = oldicon.position;
                spritegroup.addChild(newraster);
                oldicon.remove();
            } else {
                let oldicon = spritegroup.getItem({name:/.*staticicon/});
                let newraster = new Raster("budgeticon");
                newraster.pivot = newraster.globalToLocal(newraster.bounds.bottomCenter);
                newraster.position = oldicon.position;
                spritegroup.addChild(newraster);
                oldicon.remove();
                newmask = makeBudgetMask(spritegroup, barstat);
                newmask.fillColor = targetcolor;
            }
        } else {
            newmask = new Path.Rectangle({
                from: [icon.bounds.topLeft.x - 25 ,icon.bounds.topLeft.y + (150 - (150 * (barstat.current/barstat.currentcap)))],
                to: [icon.bounds.bottomRight.x + 25,icon.bounds.bottomRight.y+25],
                fillColor: targetcolor,
                strokeColor: new Color(0,0,0,0),
                name: "valuemask"
            });
        }
        mask.remove();
        clipgroup.insertChild(0, newmask);
        valuelabel.content = `${barstat.current}`
    }

    function makeGHGBase(position, barstat){

        let spritegroup = new Group();
        let icon = new Raster(barstat.unsatisfiediconpath);
        icon.position = position
        icon.pivot = icon.globalToLocal(icon.bounds.bottomCenter);
        icon.name = `${barstat.name}staticicon`;
        let itemlabel = new PointText({
            point: icon.position.add([0,20]),
            content: barstat.name,
            fontSize: "12",
            justification: 'center',
            name: `${barstat.name}statictitle`,
        });
        spritegroup.addChildren([icon, itemlabel]);
        return spritegroup;
    }   

    function updateGHGBase(barstat, spritegroup, value){
        barstat.satisfied = value;
        let targetraster;
        if(barstat.satisfied){
            targetraster = barstat.satisfiediconpath;
        } else {
            targetraster = barstat.unsatisfiediconpath;
        }
        let oldicon = spritegroup.getItem({name:/.*staticicon/});
        let newraster = new Raster(targetraster);
        newraster.pivot = newraster.globalToLocal(newraster.bounds.bottomCenter);
        newraster.position = oldicon.position;
        spritegroup.addChild(newraster);
        oldicon.remove();

    }

    function makeBudgetMask(spritegroup, barstat){
        let icon = spritegroup.getItem({
            name: /.*outline/
        });
        if(barstat.current > barstat.currentcap){
            let maskpath = new Path({
                rectangle: icon.bounds,
                fillColor: "red",
            });
            return maskpath
        }
        const baseposition = icon.position;

        const middletoppoint = baseposition.subtract([25,15]);
        const lefttoppoint = baseposition.subtract([100,31]);
        const righttoppoint = baseposition.subtract([-98,79]);
        const rightbotpoint = baseposition.subtract([-98,-12]);
        const middlebotpoint = baseposition.subtract([25,-98]);
        const leftbotpoint = baseposition.subtract([100,-68]);

        const toppoints = [lefttoppoint, middletoppoint, righttoppoint];
        const botpoints = [leftbotpoint, middlebotpoint, rightbotpoint];
        let newtops = []

        const percentfull = (barstat.current / barstat.currentcap);
        
        for(let i = 0; i < 3; i++){
            tp = toppoints[i].y;
            bp = botpoints[i].y;
            const totdistance = bp - tp;
            const offset = percentfull * totdistance;
            const globaloffset = bp - offset;
            newtops.push(new Point(toppoints[i].x,globaloffset));
        }



        let maskpath = new Path({
            segments: [newtops[0], newtops[1], newtops[2],  
               rightbotpoint, middlebotpoint, leftbotpoint],
            closed: true,
        });
        return maskpath
    }
}
  
  
  
  

  

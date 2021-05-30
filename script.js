'use strict';
( function createLineGraphs(){
    
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.querySelector('.svg');
    const errorMessage = document.getElementById('error');
    let xValues = [];  


    //////////   CONFIGURABLE  /////////////////////////////
    const urls = [
            "http://localhost:5501/data/datasetArr3.json",
            "http://localhost:5501/data/datasetArr2.json",
            "http://localhost:5501/data/datasetArr1.json"
        ],
        graphHeight = 300,
        graphWidth = 600,
        xAxisLabel = 'distance',
        yAxisLabel = 'altitude',
        xStep = 50,
        yStep = 500,
        numOfGridLines = 3,       // horizontal faded dash lines
        type = 'C',             // curved: C - linear: L
        colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00'];

    ////////////////////////////////////////////////////////////    

    const configData = data => {     
        
        // dataSet data needs to be divisible by 3; // 9, 12, 18 points etc.
        const fixDataLength = set => {   
            const setLength = set.length - set.length % 3;   
            return set.slice(0, setLength);
        };

        // for svg graph to be right way up
        const reverseYValues = data => 
            data.map(el => el.map(e => [ e[0], graphHeight - e[1] ] ));

        const getMinMax = data => {
            let allX = [], allY = [];         
            data.map(sets => sets.map(el => { 
                    allX = [ ...allX, el[0] ];
                    allY = [ ...allY, el[1] ];
                })
            );       
            return {
                minX:  Math.min(...allX),
                minY:  Math.min(...allY),
                maxX:  Math.max(...allX),
                maxY:  Math.max(...allY)
            };
        };

        // scale graph values to graph px dimensions
        const fitToGraphSize = data => { 
            return data.map(set => set.map(el => 
                [ 
                    ~~((graphWidth/minMaxVals.maxX)*el[0]), 
                    ~~((graphHeight/minMaxVals.maxY)*el[1]) 
                ]
            ))
        };

        const newData = data.map(set => {    
            if(!Array.isArray(set)) throw new Error(`Data format type not supported!`);
            const newSet = fixDataLength(set);  

            return newSet.map((el, i, arr) => {

                if(!Array.isArray(el) && typeof el === "object"){
                    if(!el.x || !el.y) throw new Error(`This data obj format is not supported!`);
                    if(el.x && isNaN(+el.x)){    
                        xValues = arr.map(el => el.x);
                        return [i, +el.y];
                    }                           
                    return [+el.x, +el.y];
                }
                if(Array.isArray(el)){
                    if(!arr.every(el => el.length === 2)) throw new Error(`This data array format is not supported!`);
                    if(isNaN(+el[0])){
                        xValues = arr.map(el => el[0]);        
                        return [i, +el[1]];
                    }
                    return [+el[0], +el[1]];
                }
            })
        });
              
        const minMaxVals = getMinMax(newData);          
        const scaledData = fitToGraphSize(newData);     
        const reverseData = reverseYValues(scaledData);
    
        return [reverseData, minMaxVals]; 
    
    };

    const createGraphAxis = vals => {
        const { minX, minY, maxX, maxY } = vals;
        const xAxis = document.createElementNS(ns, 'line');
        xAxis.setAttribute('x1', 0);
        xAxis.setAttribute('y1', graphHeight);
        xAxis.setAttribute('x2', graphWidth);
        xAxis.setAttribute('y2', graphHeight);
        xAxis.setAttribute('stroke', '#555');
        svg.appendChild(xAxis);

        const yAxis = document.createElementNS(ns, 'line');
        yAxis.setAttribute('x1', 0);
        yAxis.setAttribute('y1', graphHeight);
        yAxis.setAttribute('x2', 0);
        yAxis.setAttribute('y2', 0);
        yAxis.setAttribute('stroke', '#555');
        svg.appendChild(yAxis);

        // background grid lines
        const gridLineStep = ~~(graphHeight/numOfGridLines);
        for(let h = graphHeight; h >= gridLineStep;){
            h -= gridLineStep;   
            const grid = document.createElementNS(ns, 'line');
            grid.setAttribute('x1', 0);
            grid.setAttribute('y1', h);
            grid.setAttribute('x2', graphWidth);
            grid.setAttribute('y2', h);
            grid.setAttribute('stroke', '#c3c3c3');
            grid.setAttribute('stroke-dasharray', '3,3');
            svg.appendChild(grid);   
        }
        // y axis markers & steps
        const yInterval = ~~((graphHeight / maxY) * yStep); 
        let yVal = maxY;  
        for(let y = graphHeight; y >= yInterval;){
            y -= yInterval;
            yVal -= yStep;    
            
            const yTicks = document.createElementNS(ns, 'line');
            yTicks.setAttribute('x1', -3);
            yTicks.setAttribute('y1', y);
            yTicks.setAttribute('x2', 3);
            yTicks.setAttribute('y2', y);
            yTicks.setAttribute('stroke', '#555');
            svg.appendChild(yTicks);
            // values
            const ySteps = document.createElementNS(ns, 'text');
            ySteps.setAttribute('class', 'y-steps');
            ySteps.setAttribute('x', -30);
            ySteps.setAttribute('y', y+3);
            const yValue = (maxY - yVal);
            const yValues = document.createTextNode(yValue);
            ySteps.appendChild(yValues);
            svg.appendChild(ySteps);
        }
        // x markers and steps
        const xInterval = ~~((graphWidth / maxX) * xStep);   
        let xVal = minX;             
        let i = 0;
        for(let x = 0; x <= (graphWidth-xInterval);){
            x += xInterval; 
            if(i <= xValues.length) i += 1;           
            xVal = xValues.length 
                ? xValues[i*xStep] === undefined 
                    ? '' 
                    : xValues[i*xStep] 
                : xVal += xStep;
              
            
            const xTicks = document.createElementNS(ns, 'line');
            xTicks.setAttribute('x1', x);
            xTicks.setAttribute('y1', graphHeight-3);
            xTicks.setAttribute('x2', x);
            xTicks.setAttribute('y2', graphHeight+3);
            xTicks.setAttribute('stroke', '#555');
            svg.appendChild(xTicks);
            // values
            const xSteps = document.createElementNS(ns, 'text');
            xSteps.setAttribute('class', 'x-steps');
            xSteps.setAttribute('x', x-8);
            xSteps.setAttribute('y', graphHeight+30);
            const xValue = xVal;
            const xMarkers = document.createTextNode(xValue);
            xSteps.appendChild(xMarkers);
            svg.appendChild(xSteps);
        }

        const xLabel = document.createElementNS(ns, 'text');
        xLabel.setAttribute('x', graphWidth/2);
        xLabel.setAttribute('y', graphHeight+60);
        xLabel.setAttribute('class', 'x-label');
        const xLabelText = document.createTextNode(xAxisLabel);
        xLabel.appendChild(xLabelText);
        svg.appendChild(xLabel);
        
        const yLabel = document.createElementNS(ns, 'text');
        yLabel.setAttribute('class', 'y-label');
        yLabel.setAttribute('x', '0');
        yLabel.setAttribute('y', graphHeight/2);
        yLabel.setAttribute('text-anchor', 'end');
        yLabel.setAttribute('transform', `rotate(-90, -45, ${graphHeight/1.8})`);
        const yLabelText = document.createTextNode(yAxisLabel);
        yLabel.appendChild(yLabelText);
        svg.appendChild(yLabel);
    };


    const plotGraphs = data => {   
        data.forEach((set, i) => {     
            const init = `${set[0][0]} ${set[0][1]}`;
            const flightPath = `M${init} ${type}${set}`;   
            
            const route = document.createElementNS(ns, 'path');
            route.setAttribute('d', flightPath);
            route.setAttribute('stroke', `${colors[i]}`);
            route.setAttribute('fill', 'none');
            svg.appendChild(route);
        });    

    };

    const fetchData = async (url) => {
        const res = await fetch(url);
        if(!res.ok) throw new Error(`Data issue: ${res.status}`); 
        return res.json(); 
    }
    
    const renderError  = err => errorMessage.textContent = err;
    
    (async function init(){
        try {
            const dataSets = urls.map(url => fetchData(url));
            const data = await Promise.all(dataSets); 
            const [newData, minMaxVals] = await Promise.resolve(configData(data));             
            createGraphAxis(minMaxVals);
            plotGraphs(newData);
        } catch(err){
            console.error(`${err}`);
            renderError(err);
        }
    })();
})();









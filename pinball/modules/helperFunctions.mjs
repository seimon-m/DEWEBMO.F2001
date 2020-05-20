export const closestPointOnLine = (lx1, ly1, lx2, ly2, x0, y0) => { 
    let A1 = ly2 - ly1; 
    let B1 = lx1 - lx2; 
    let C1 = (ly2 - ly1)*lx1 + (lx1 - lx2)*ly1; 
    let C2 = -B1*x0 + A1*y0; 
    let det = A1*A1 - (-B1)*B1; 
    let cx = 0; 
    let cy = 0; 
    if(det !== 0){ 
       cx = ((A1*C1 - B1*C2)/det); 
       cy = ((A1*C2 - (-B1)*C1)/det); 
    }else{ 
       cx = x0; 
       cy = y0; 
    } 
    return {x:cx, y:cy}; 
};
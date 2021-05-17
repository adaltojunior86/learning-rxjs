import "./styles.css";
import { fromEvent, merge } from "rxjs";
import { filter, withLatestFrom, mapTo, tap } from "rxjs/operators";

document.getElementById("app").innerHTML = `
      <h2>Take the 🐈 to the 🎉</h2>
      <div id="loader" style="display:none;position:absolute;right:0;z-index:-1;">
        <img src="https://media2.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.webp?cid=ecf05e479338392950f1cf8bade564aaec071e3aae3b68b0&rid=giphy.webp" width="248" height="248" style="opacity:0.5;"/>
        <span id="countdown" style="top:0;right:0;position:absolute;z-index:9999;font-weight:bold;font-size:46px;">-</span>
      </div>
      <div id="drop-zone" style="position:absolute;right:5px;bottom:5px;width:180px;height:180px;border:2px dashed black;z-index:2;">
      </div>
      <img src="https://i.ebayimg.com/images/g/qHEAAOSw01pdVAaZ/s-l300.jpg" width="150" height="150" style="position:absolute;right:20px;bottom:20px;"/>
      <img id="cat" draggable="true" src="https://image.shutterstock.com/image-vector/vintage-scooter-cat-cool-stuff-260nw-429646657.jpg" width="100" height="100" style="position:absolute;z-index:1;margin:18px 16px;text-align:center;cursor:grab;"/>
      <div id="decoy" draggable="true" style="font-size:28px;position:absolute;left:20px;bottom:10px;text-align:center;cursor:grab;font-weight:bold;">DECOY</div>
    `;

fromEvent(document, "dragover")
  .pipe(tap((event) => event.preventDefault()))
  .subscribe();

const cat = document.getElementById("cat");
const party = document.getElementById("drop-zone");
const loading = document.getElementById("loader");
const countdown = document.getElementById("countdown");
const dragStartEvent = fromEvent(document, "dragstart");
const dragEndEvent = fromEvent(document, "dragend");
const dropEvent = fromEvent(document, "drop");
const filterCat = filter((event) => event.target === cat);

const partyDrop = dropEvent.pipe(filter((e) => e.target === party));
const catIsAtParty = partyDrop.pipe(
  withLatestFrom(dragStartEvent),
  filter(([_, dragStartEvt]) => dragStartEvt.target === cat)
);

catIsAtParty.subscribe(() => {
  cat.remove();
  party.appendChild(cat);
});

merge(
  dragStartEvent.pipe(filterCat, mapTo(0)),
  dragEndEvent.pipe(filterCat, mapTo(1))
).subscribe((value) => (cat.style.opacity = value));

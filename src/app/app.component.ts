import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var ol:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  latitude: number = 12.9791198;
  longitude: number = 77.5912997;
  address = ''

  map: any;

  constructor (private http: HttpClient) {}

  ngOnInit() {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position)
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.createMap()
      },
      accessDenied => {
        console.log(accessDenied)
        this.createMap()
      })
    } else {
      this.createMap()
      alert("Geolocation is not supported by this browser.");
    }
  }

  createMap() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 12
      })
    });
    this.setCenter(this.latitude, this.longitude)
  }

  onDrag(e) {
    const longLat = ol.proj.toLonLat(this.map.getView().getCenter())
    this.longitude = longLat[0]
    this.latitude = longLat[1]
  }

  setCenter(lat, long) {
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([long, lat]));
    this.map.on('moveend', this.onDrag.bind(this))
  }

  moveToCenter(lat, lon) {
    if (lat < this.latitude && lon < this.longitude) {
      let interval = setInterval(() => {
        this.latitude -= 0.01
        this.longitude -= 0.01
        this.setCenter(this.latitude, this.longitude)
        if (!(lat < this.latitude && lon < this.longitude)) {
          clearInterval(interval)
          this.latitude = lat
          this.longitude = lon
          this.setCenter(this.latitude, this.longitude)
        }
      },50)
    } else if (lat > this.latitude && lon > this.longitude) {
      let interval = setInterval(() => {
        this.latitude += 0.01
        this.longitude += 0.01
        this.setCenter(this.latitude, this.longitude)
        if (!(lat > this.latitude && lon > this.longitude)) {
          clearInterval(interval)
          this.latitude = lat
          this.longitude = lon
          this.setCenter(this.latitude, this.longitude)
        }
      },50)
    } else if (lat < this.latitude && lon > this.longitude) {
      let interval = setInterval(() => {
        this.latitude -= 0.01
        this.longitude += 0.01
        this.setCenter(this.latitude, this.longitude)
        if (!(lat < this.latitude && lon < this.longitude)) {
          clearInterval(interval)
          this.latitude = lat
          this.longitude = lon
          this.setCenter(this.latitude, this.longitude)
        }
      },50)
    } else if (lat > this.latitude && lon < this.longitude) {
      let interval = setInterval(() => {
        this.latitude += 0.01
        this.longitude -= 0.01
        this.setCenter(this.latitude, this.longitude)
        if (!(lat < this.latitude && lon < this.longitude)) {
          clearInterval(interval)
          this.latitude = lat
          this.longitude = lon
          this.setCenter(this.latitude, this.longitude)
        }
      },50)
    }
  }

  onSubmit(e) {
    this.http
      .get('https://nominatim.openstreetmap.org/search?format=json&q='+this.address)
      .subscribe(data => {
        // this.longitude = parseFloat(data[0].lon)
        // this.latitude = parseFloat(data[0].lat)
        this.moveToCenter(parseFloat(data[0].lat), parseFloat(data[0].lon))
      })
    return false
  }
}
 
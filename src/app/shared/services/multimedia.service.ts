import { Injectable , EventEmitter } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { BehaviorSubject, Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {
  callback: EventEmitter <any> = new EventEmitter <any>()

  
  public trackInfo$: BehaviorSubject<any> = new BehaviorSubject(undefined)
  public audio!: HTMLAudioElement
  public timeLapsed$:BehaviorSubject<string> = new BehaviorSubject('00:00')
  public timeRemaning$:BehaviorSubject<string> = new BehaviorSubject('-00:00')
  public playerStatus$:BehaviorSubject<string> = new BehaviorSubject('paused')
  public playerPercentage$:BehaviorSubject<number> = new BehaviorSubject(0)


  constructor() {
    this.audio = new Audio()
    this.trackInfo$.subscribe(responseOk =>{
      if (responseOk) {
        this.setAudio(responseOk)
      }
      
    })
    this.listenAllElements()
    
   }

  private listenAllElements(): void{
    this.audio.addEventListener('timeupdate', this.calculateTime,false)
    this.audio.addEventListener('playing', this.setPlayerStatus,false)
    this.audio.addEventListener('play', this.setPlayerStatus,false)
    this.audio.addEventListener('pause', this.setPlayerStatus,false)
    this.audio.addEventListener('ended', this.setPlayerStatus,false)
    
  }
  private setPlayerStatus =(state: any) => {
    switch(state.type){
      case 'play':
        this.playerStatus$.next('play')
        break;
        case 'playing':
        this.playerStatus$.next('playing')
        break;
        case 'ended':
        this.playerStatus$.next('ended')
        break;
      default:
        this.playerStatus$.next('paused')
        break;
    }

  }

  private calculateTime= () =>{
      const {duration, currentTime} = this.audio
      this.setTimeElapsed(currentTime)
      this.setRemaining(currentTime, duration)
      this.setPercentage(currentTime, duration)
  }

  private setPercentage(currentTime:number, duration:number):void{
    //Duracion de la cancion será el 100% y el current será lo que hay que calcular
    let percentage = (currentTime * 100)/duration;
    this.playerPercentage$.next(percentage)
  }

  private setTimeElapsed(currentTime:number):void{
    let seconds = Math.floor(currentTime % 60)
    let minutes = Math.floor((currentTime / 60) % 60)
    const displaySeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const displayMinutes = (minutes < 10) ? `0${minutes}` : minutes;
    const displayFormat = `${displayMinutes}:${displaySeconds}`
    this.timeLapsed$.next(displayFormat)

  }

  private setRemaining(currentTime: number, duration: number):void{
    let timeLeft = duration -currentTime;
    
    let seconds = Math.floor(timeLeft % 60)
    let minutes = Math.floor((timeLeft / 60) % 60)
    const displaySeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const displayMinutes = (minutes < 10) ? `0${minutes}` : minutes;
    const displayFormat = `${displayMinutes}:${displaySeconds}`
    this.timeRemaning$.next(displayFormat)
  }


  //Funciones publicas

  public setAudio(track: TrackModel): void{
    
    console.log('Desde el servicio', track)
    this.audio.src = track.url
    this.audio.play()
  }

  public togglePlayer(): void{
    (this.audio.paused) ? this.audio.play(): this.audio.pause()
  }

  public seekAudio(percentage:number):void{
    const{duration} = this.audio
    //Aplicamos otra regla de 3
    const percentageToSecond = (percentage*duration)/100
    this.audio.currentTime = percentageToSecond
  }
}
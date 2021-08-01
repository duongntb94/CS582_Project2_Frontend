import React from 'react'
import { MovieModel } from '../../models'
import { Swiper, SwiperSlide } from 'swiper/react'
import './carousel.css'
import { CircularProgress, Grid } from '@material-ui/core'

interface ICarouselProps {
  isLoading: boolean
  title: string
  items: MovieModel[]
  onPress(item: MovieModel): void
}

export const Carousel: React.FC<ICarouselProps> = (props: ICarouselProps) => {
  const { isLoading, title, items, onPress } = props
  return (
    <div>
      <p className='title'>{title}</p>
      {isLoading && (
        <Swiper
          slidesPerView={6}
          spaceBetween={5}
          slidesPerGroup={6}
          navigation={false}>
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <SwiperSlide key={`${item}`}>
              <Grid className='movie-item'>
                <CircularProgress />
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {isLoading || (
        <Swiper
          autoplay
          slidesPerView={6}
          spaceBetween={5}
          slidesPerGroup={6}
          loop={true}
          loopFillGroupWithBlank={true}
          navigation={true}>
          {items.map((item, index) => (
            <SwiperSlide
              key={`${item.id}${index}`}
              onClick={() => onPress(item)}>
              <Grid className='movie-item'>
                <img src={item.thumbnail} alt='' />
                <div className='movie-item-title'>{item.name}</div>
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}

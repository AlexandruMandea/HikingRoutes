import { Controller, Get, Res } from '@nestjs/common';
import { AllowAny } from '../authentication/decorators/allow-any-decorator';
import { Response } from 'express'

@Controller('style-renderer')
export class StyleRendererController {

    @Get('get/google-marker')
    @AllowAny()
    getGoogleMarker(@Res() res: Response) {
        return res.sendFile('google_marker.png', { root: './images/styles/markers' });
    }

    @Get('get/red-flag-marker')
    @AllowAny()
    getRedFlagMarker(@Res() res: Response) {
        return res.sendFile('red_flag_marker.png', { root: './images/styles/markers' });
    }

    @Get('get/red-marker')
    @AllowAny()
    getRedMarker(@Res() res: Response) {
        return res.sendFile('red_marker.png', { root: './images/styles/markers' });
    }

    @Get('get/bike-marker')
    @AllowAny()
    getBikeMarker(@Res() res: Response) {
        return res.sendFile('bike.png', { root: './images/styles/markers' });
    }

    @Get('get/hiker-marker')
    @AllowAny()
    getHikerMarker(@Res() res: Response) {
        return res.sendFile('hiker.png', { root: './images/styles/markers' });
    }

    @Get('get/cover-photo')
    @AllowAny()
    getCoverPhoto(@Res() res: Response) {
        return res.sendFile('home-cover.jpeg', { root: './images/styles/wallpapers' });
    }
}

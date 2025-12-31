
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'place-holder',
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'place-holder',
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
        };
        done(null, user);
    }
}

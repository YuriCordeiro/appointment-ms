import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Timestamp } from "typeorm";

@Injectable()
export class JWTUtil {
    constructor(private readonly jwtService: JwtService) { }

    // {"sub":15,"role":"patient","name":"salinas","iat":1727142196,"exp":1727145796}

    decode(auth: string): { sub: number, role: string, name: string, iat: Timestamp, exp: Timestamp } {
        const jwt = auth.replace('Bearer ', '');
        return this.jwtService.decode(jwt, { json: true }) as { sub: number, role: string, name: string, iat: Timestamp, exp: Timestamp };
    }
}
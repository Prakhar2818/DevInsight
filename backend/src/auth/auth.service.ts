import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userDto: any) {
    const existingUser = await this.usersService.findByEmail(userDto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const createdUser = await this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });

    const payload = {
      email: createdUser.email,
      sub: createdUser._id,
      role: createdUser.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        avatar: createdUser.avatar,
      },
    };
  }

  async login(userDto: any) {
    const user = await this.usersService.findByEmail(userDto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  async githubLogin(code: string) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new UnauthorizedException('GitHub OAuth not configured on server');
    }

    // 1. Exchange code for access_token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData: any = await tokenResponse.json();
    if (tokenData.error) {
      console.error("GITHUB TOKEN ERROR:", tokenData);
      throw new UnauthorizedException(`GitHub OAuth error: ${tokenData.error_description}`);
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const githubUser: any = await userResponse.json();

    // 3. Fetch user emails
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const emailsData: any = await emailsResponse.json();
    const primaryEmail = emailsData.find((e: any) => e.primary)?.email || emailsData[0]?.email;

    if (!primaryEmail) {
      throw new UnauthorizedException('No email found on GitHub account');
    }

    // 4. Find or create user
    let user = await this.usersService.findByEmail(primaryEmail);

    if (user) {
      // Update existing user with GitHub info
      user = await this.usersService.update(user._id.toString(), {
        githubId: githubUser.id.toString(),
        githubToken: accessToken,
        provider: 'github',
        avatar: user.avatar || githubUser.avatar_url,
      });
    } else {
      // Create new user
      user = await this.usersService.create({
        name: githubUser.name || githubUser.login,
        email: primaryEmail,
        provider: 'github',
        githubId: githubUser.id.toString(),
        githubToken: accessToken,
        avatar: githubUser.avatar_url,
        // No password needed for OAuth users
      });
    }

    // 5. Generate JWT
    const payload = { email: user!.email, sub: user!._id, role: user!.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user!._id,
        name: user!.name,
        email: user!.email,
        role: user!.role,
        avatar: user!.avatar,
      },
    };
  }
}

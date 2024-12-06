import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CaptchaFingerPrint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column()
  lastAttempt: Date;

  @Column()
  totalFailed: number;

  @Column({ default: false })
  isFlappyBirdValidated: boolean;
}

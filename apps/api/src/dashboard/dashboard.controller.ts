
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
// import { AuthGuard } from '@nestjs/passport'; // Uncomment when ready to protect
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../common/decorators/roles.decorator';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get()
    //   @UseGuards(AuthGuard('jwt'), RolesGuard) // Protect this later
    //   @Roles('ADMIN')
    async getDashboardStats(): Promise<any> {
        return this.dashboardService.getStats();
    }
}

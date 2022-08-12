using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseProjectWebApp.Migrations
{
    public partial class ReworkOfCollection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdditionalStrings_Collection_CollectionId",
                table: "AdditionalStrings");

            migrationBuilder.DropForeignKey(
                name: "FK_Collection_AspNetUsers_ApplicationUserId",
                table: "Collection");

            migrationBuilder.DropColumn(
                name: "Data",
                table: "AdditionalStrings");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "Collection",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "CollectionId",
                table: "AdditionalStrings",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_AdditionalStrings_Collection_CollectionId",
                table: "AdditionalStrings",
                column: "CollectionId",
                principalTable: "Collection",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Collection_AspNetUsers_ApplicationUserId",
                table: "Collection",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdditionalStrings_Collection_CollectionId",
                table: "AdditionalStrings");

            migrationBuilder.DropForeignKey(
                name: "FK_Collection_AspNetUsers_ApplicationUserId",
                table: "Collection");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "Collection",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CollectionId",
                table: "AdditionalStrings",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Data",
                table: "AdditionalStrings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_AdditionalStrings_Collection_CollectionId",
                table: "AdditionalStrings",
                column: "CollectionId",
                principalTable: "Collection",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Collection_AspNetUsers_ApplicationUserId",
                table: "Collection",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

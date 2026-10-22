<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PelangganController extends Controller
{
    public function index()
    {
        try {
            // Menggunakan Eloquent Query Builder agar aman dari error strict mode MySQL
            $pelanggan = DB::table('orders as a')
                ->leftJoin('users as b', 'b.id', '=', 'a.user_id')
                ->select(
                    'a.id',
                    'a.user_id',
                    'b.Nama',
                    'b.email',
                    'b.phone',
                    DB::raw('DATE(b.created_at) as tgl_gabung'),
                    'b.role as stt',
                    DB::raw('MAX(DATE(a.created_at)) as tgl_terakhir_order'),
                    DB::raw('COUNT(a.id) as jml_order')
                )
                ->groupBy('a.user_id', 'b.id', 'b.Nama', 'b.email', 'b.phone', 'b.created_at', 'b.role', 'a.id')
                ->orderBy('tgl_terakhir_order', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $pelanggan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}